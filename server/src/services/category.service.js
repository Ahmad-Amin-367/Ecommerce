const prisma = require('../config/db');
const ApiError = require('../utils/apiError');

const generateSlug = (name) =>
  name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');

/**
 * Get all categories (tree or flat)
 */
const getCategories = async (tree = false) => {
  if (tree) {
    return prisma.category.findMany({
      where: { parentId: null, isActive: true },
      include: {
        children: {
          where: { isActive: true },
          include: { _count: { select: { products: true } } },
        },
        _count: { select: { products: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  return prisma.category.findMany({
    where: { isActive: true },
    include: { _count: { select: { products: true } } },
    orderBy: { name: 'asc' },
  });
};

/**
 * Get single category by ID or slug
 */
const getCategory = async (identifier) => {
  const isId = /^[a-zA-Z0-9]{25}$/.test(identifier);
  const where = isId ? { id: identifier } : { slug: identifier };

  const category = await prisma.category.findUnique({
    where,
    include: {
      children: { where: { isActive: true } },
      parent: true,
      _count: { select: { products: true } },
    },
  });

  if (!category) throw ApiError.notFound('Category not found');
  return category;
};

/**
 * Create category (Admin)
 */
const createCategory = async (data) => {
  const slug = data.slug || generateSlug(data.name);
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) throw ApiError.conflict('A category with this slug already exists');

  if (data.parentId) {
    const parent = await prisma.category.findUnique({ where: { id: data.parentId } });
    if (!parent) throw ApiError.notFound('Parent category not found');
  }

  return prisma.category.create({ data: { ...data, slug } });
};

/**
 * Update category (Admin)
 */
const updateCategory = async (id, data) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) throw ApiError.notFound('Category not found');

  return prisma.category.update({ where: { id }, data });
};

/**
 * Delete category (Admin)
 */
const deleteCategory = async (id) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true, children: true } } },
  });
  if (!category) throw ApiError.notFound('Category not found');
  if (category._count.products > 0) {
    throw ApiError.conflict('Cannot delete category with existing products');
  }
  if (category._count.children > 0) {
    throw ApiError.conflict('Cannot delete category with existing subcategories');
  }

  await prisma.category.delete({ where: { id } });
};

module.exports = { getCategories, getCategory, createCategory, updateCategory, deleteCategory };
