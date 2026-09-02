const productService = require('../services/product.service');
const { sendSuccess } = require('../utils/apiResponse');
const { getIO } = require('../config/socket');

const getProducts = async (req, res) => {
  const { products, meta } = await productService.getProducts(req.query);
  sendSuccess(res, 200, 'Products fetched', products, meta);
};

const getProduct = async (req, res) => {
  const product = await productService.getProduct(req.params.identifier);
  sendSuccess(res, 200, 'Product fetched', product);
};

const createProduct = async (req, res) => {
  const product = await productService.createProduct(req.body);
  try { getIO().emit('invalidate_products'); } catch(e) {}
  sendSuccess(res, 201, 'Product created', product);
};

const updateProduct = async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  try { getIO().emit('invalidate_products'); } catch(e) {}
  sendSuccess(res, 200, 'Product updated', product);
};

const deleteProduct = async (req, res) => {
  await productService.deleteProduct(req.params.id);
  try { getIO().emit('invalidate_products'); } catch(e) {}
  sendSuccess(res, 200, 'Product deleted');
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
