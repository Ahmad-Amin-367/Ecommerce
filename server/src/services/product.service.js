const { Op } = require('sequelize');
const { Product, Category, Review, User } = require('../models');
const ApiError = require('../utils/apiError');
const { paginate } = require('../utils/pagination');

/**
 * Generate a URL-safe slug from a string
 */
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

/**
 * Ensure slug is unique — appends a number if taken
 */
const ensureUniqueSlug = async (slug, excludeId = null) => {
  let candidate = slug;
  let counter = 1;

  while (true) {
    const existing = await Product.findOne({ where: { slug: candidate } });
    if (!existing || existing.id === excludeId) break;
    candidate = `${slug}-${counter++}`;
  }
  return candidate;
};

/**
 * Get paginated product list with filters
 */
const getProducts = async (query) => {
  const { page, search, exactName, categoryId, category, minPrice, maxPrice, isActive, isFeatured, sortBy, sortOrder } = query;
  const limit = query.limit || 50;

  const where = {};
  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
    ];
  }
  if (exactName) {
    where.name = { [Op.iLike]: exactName };
  }
  if (categoryId) where.categoryId = categoryId;
  if (isActive !== undefined) where.isActive = isActive === 'true' || isActive === true;
  if (isFeatured !== undefined) where.isFeatured = isFeatured === 'true' || isFeatured === true;

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined && minPrice !== '') where.price[Op.gte] = Number(minPrice);
    if (maxPrice !== undefined && maxPrice !== '') where.price[Op.lte] = Number(maxPrice);
    if (Object.getOwnPropertySymbols(where.price).length === 0) delete where.price;
  }

  const categoryInclude = {
    model: Category,
    as: 'category',
    attributes: ['id', 'name', 'slug'],
  };

  if (category) {
    categoryInclude.where = { slug: category };
  }

  const totalCount = await Product.count({
    where,
    include: category ? [categoryInclude] : [],
  });

  const { skip, take, meta } = paginate({ page, limit }, totalCount);

  const orderField = sortBy || 'createdAt';
  const orderDirection = (sortOrder || 'desc').toUpperCase();

  const products = await Product.findAll({
    where,
    offset: skip,
    limit: take,
    order: [[orderField, orderDirection]],
    include: [
      categoryInclude,
      {
        model: Review,
        as: 'reviews',
        attributes: ['id'],
      },
    ],
  });

  const formattedProducts = products.map((p) => {
    const json = p.toJSON();
    const reviewCount = json.reviews?.length || 0;
    delete json.reviews;
    return {
      ...json,
      _count: { reviews: reviewCount },
    };
  });

  return { products: formattedProducts, meta };
};

/**
 * Get a single product by ID or slug
 */
const getProduct = async (identifier) => {
  // Check if identifier is UUID
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);
  const where = isUUID ? { id: identifier } : { slug: identifier };

  const product = await Product.findOne({
    where,
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'slug'],
      },
      {
        model: Review,
        as: 'reviews',
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name'],
          },
        ],
        order: [['createdAt', 'DESC']],
        limit: 10,
      },
    ],
  });

  if (!product) throw ApiError.notFound('Product not found');

  const json = product.toJSON();
  const reviewCount = json.reviews?.length || 0;

  return {
    ...json,
    _count: { reviews: reviewCount },
  };
};

/**
 * Create a new product (Admin)
 */
const createProduct = async (data) => {
  const category = await Category.findByPk(data.categoryId);
  if (!category) throw ApiError.notFound('Category not found');

  const tempSlug = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

  const product = await Product.create({
    ...data,
    slug: tempSlug,
  });

  let finalSlug = `${generateSlug(data.name)}-${product.id.slice(-6)}`;
  finalSlug = await ensureUniqueSlug(finalSlug);

  await product.update({ slug: finalSlug });

  return Product.findByPk(product.id, {
    include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
  });
};

/**
 * Update a product (Admin)
 */
const updateProduct = async (productId, data) => {
  const product = await Product.findByPk(productId);
  if (!product) throw ApiError.notFound('Product not found');

  const updateData = { ...data };
  if (updateData.slug) delete updateData.slug;

  await product.update(updateData);

  return Product.findByPk(productId, {
    include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
  });
};

/**
 * Delete a product (Admin)
 */
const deleteProduct = async (productId) => {
  const product = await Product.findByPk(productId);
  if (!product) throw ApiError.notFound('Product not found');

  await product.destroy();
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
