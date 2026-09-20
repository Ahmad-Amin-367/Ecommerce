const { Category, Product } = require('../models');
const ApiError = require('../utils/apiError');

const generateSlug = (name) =>
  name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');

/**
 * Get all categories (tree or flat)
 */
const getCategories = async (tree = false) => {
  if (tree) {
    const categories = await Category.findAll({
      where: { parentId: null, isActive: true },
      include: [
        {
          model: Category,
          as: 'children',
          where: { isActive: true },
          required: false,
          include: [{ model: Product, as: 'products', attributes: ['id'] }],
        },
        {
          model: Product,
          as: 'products',
          attributes: ['id'],
        },
      ],
      order: [['name', 'ASC']],
    });

    return categories.map((c) => {
      const json = c.toJSON();
      const productCount = json.products?.length || 0;
      delete json.products;

      const children = (json.children || []).map((ch) => {
        const chCount = ch.products?.length || 0;
        delete ch.products;
        return {
          ...ch,
          _count: { products: chCount },
        };
      });

      return {
        ...json,
        children,
        _count: { products: productCount },
      };
    });
  }

  const categories = await Category.findAll({
    where: { isActive: true },
    include: [{ model: Product, as: 'products', attributes: ['id'] }],
    order: [['name', 'ASC']],
  });

  return categories.map((c) => {
    const json = c.toJSON();
    const count = json.products?.length || 0;
    delete json.products;
    return {
      ...json,
      _count: { products: count },
    };
  });
};

/**
 * Get single category by ID or slug
 */
const getCategory = async (identifier) => {
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);
  const where = isUUID ? { id: identifier } : { slug: identifier };

  const category = await Category.findOne({
    where,
    include: [
      {
        model: Category,
        as: 'children',
        where: { isActive: true },
        required: false,
      },
      {
        model: Category,
        as: 'parent',
      },
      {
        model: Product,
        as: 'products',
        attributes: ['id'],
      },
    ],
  });

  if (!category) throw ApiError.notFound('Category not found');

  const json = category.toJSON();
  const productCount = json.products?.length || 0;
  delete json.products;

  return {
    ...json,
    _count: { products: productCount },
  };
};

/**
 * Create category (Admin)
 */
const createCategory = async (data) => {
  const slug = data.slug || generateSlug(data.name);
  const existing = await Category.findOne({ where: { slug } });
  if (existing) throw ApiError.conflict('A category with this slug already exists');

  if (data.parentId) {
    const parent = await Category.findByPk(data.parentId);
    if (!parent) throw ApiError.notFound('Parent category not found');
  }

  return Category.create({ ...data, slug });
};

/**
 * Update category (Admin)
 */
const updateCategory = async (id, data) => {
  const category = await Category.findByPk(id);
  if (!category) throw ApiError.notFound('Category not found');

  return category.update(data);
};

/**
 * Delete category (Admin)
 */
const deleteCategory = async (id) => {
  const category = await Category.findByPk(id, {
    include: [
      { model: Product, as: 'products', attributes: ['id'] },
      { model: Category, as: 'children', attributes: ['id'] },
    ],
  });

  if (!category) throw ApiError.notFound('Category not found');

  const productCount = category.products?.length || 0;
  const childrenCount = category.children?.length || 0;

  if (productCount > 0) {
    throw ApiError.conflict('Cannot delete category with existing products');
  }
  if (childrenCount > 0) {
    throw ApiError.conflict('Cannot delete category with existing subcategories');
  }

  await category.destroy();
};

module.exports = { getCategories, getCategory, createCategory, updateCategory, deleteCategory };
