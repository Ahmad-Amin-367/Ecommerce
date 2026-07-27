const prisma = require('../config/db');
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
    const existing = await prisma.product.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === excludeId) break;
    candidate = `${slug}-${counter++}`;
  }
  return candidate;
};

/**
 * Get paginated product list with filters
 */
const getProducts = async (query) => {
  const { page, limit, search, categoryId, category, minPrice, maxPrice, isActive, isFeatured, sortBy, sortOrder } = query;

  const where = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { tags: { has: search } },
    ];
  }
  if (categoryId) where.categoryId = categoryId;
  if (category) {
    where.category = { slug: category };
  }
  if (isActive !== undefined) where.isActive = isActive === 'true' || isActive === true;
  if (isFeatured !== undefined) where.isFeatured = isFeatured === 'true' || isFeatured === true;
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined && minPrice !== '') where.price.gte = Number(minPrice);
    if (maxPrice !== undefined && maxPrice !== '') where.price.lte = Number(maxPrice);
    if (Object.keys(where.price).length === 0) delete where.price;
  }

  const totalCount = await prisma.product.count({ where });
  const { skip, take, meta } = paginate({ page, limit }, totalCount);

  const products = await prisma.product.findMany({
    where,
    skip,
    take,
    orderBy: { [sortBy]: sortOrder },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      _count: { select: { reviews: true } },
    },
  });

  return { products, meta };
};

/**
 * Get a single product by ID or slug
 */
const getProduct = async (identifier) => {
  const where = identifier.match(/^[a-z0-9-]+$/) && !identifier.match(/^[a-f0-9]{24}$/)
    ? { slug: identifier }
    : { id: identifier };

  const product = await prisma.product.findUnique({
    where,
    include: {
      category: { select: { id: true, name: true, slug: true } },
      reviews: {
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, name: true } } },
      },
      _count: { select: { reviews: true } },
    },
  });

  if (!product) throw ApiError.notFound('Product not found');
  return product;
};

/**
 * Create a new product (Admin)
 */
const createProduct = async (data) => {
  const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
  if (!category) throw ApiError.notFound('Category not found');

  const slug = await ensureUniqueSlug(data.slug || generateSlug(data.name));

  const product = await prisma.product.create({
    data: { ...data, slug },
    include: { category: { select: { id: true, name: true } } },
  });

  return product;
};

/**
 * Update a product (Admin)
 */
const updateProduct = async (productId, data) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw ApiError.notFound('Product not found');

  if (data.slug) {
    data.slug = await ensureUniqueSlug(data.slug, productId);
  }

  return prisma.product.update({
    where: { id: productId },
    data,
    include: { category: { select: { id: true, name: true } } },
  });
};

/**
 * Delete a product (Admin)
 */
const deleteProduct = async (productId) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw ApiError.notFound('Product not found');

  await prisma.product.delete({ where: { id: productId } });
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
