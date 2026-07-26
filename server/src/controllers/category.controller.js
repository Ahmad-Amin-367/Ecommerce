const categoryService = require('../services/category.service');
const { sendSuccess } = require('../utils/apiResponse');

const getCategories = async (req, res) => {
  const tree = req.query.tree === 'true';
  const categories = await categoryService.getCategories(tree);
  sendSuccess(res, 200, 'Categories fetched', categories);
};

const getCategory = async (req, res) => {
  const category = await categoryService.getCategory(req.params.identifier);
  sendSuccess(res, 200, 'Category fetched', category);
};

const createCategory = async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  sendSuccess(res, 201, 'Category created', category);
};

const updateCategory = async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  sendSuccess(res, 200, 'Category updated', category);
};

const deleteCategory = async (req, res) => {
  await categoryService.deleteCategory(req.params.id);
  sendSuccess(res, 200, 'Category deleted');
};

module.exports = { getCategories, getCategory, createCategory, updateCategory, deleteCategory };
