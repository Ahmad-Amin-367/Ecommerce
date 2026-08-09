const b2bService = require('../services/b2b.service');
const { sendSuccess } = require('../utils/apiResponse');

const createQuote = async (req, res, next) => {
  try {
    const quote = await b2bService.createQuote(req.body);
    sendSuccess(res, 201, 'B2B Quote request submitted successfully', quote);
  } catch (error) {
    next(error);
  }
};

const getQuotes = async (req, res, next) => {
  try {
    const result = await b2bService.getQuotes(req.query);
    sendSuccess(res, 200, 'B2B Quotes fetched successfully', result);
  } catch (error) {
    next(error);
  }
};

const getQuoteById = async (req, res, next) => {
  try {
    const quote = await b2bService.getQuoteById(req.params.id);
    sendSuccess(res, 200, 'B2B Quote fetched successfully', quote);
  } catch (error) {
    next(error);
  }
};

const updateQuote = async (req, res, next) => {
  try {
    const quote = await b2bService.updateQuote(req.params.id, req.body);
    sendSuccess(res, 200, 'B2B Quote updated successfully', quote);
  } catch (error) {
    next(error);
  }
};

const deleteQuote = async (req, res, next) => {
  try {
    await b2bService.deleteQuote(req.params.id);
    sendSuccess(res, 200, 'B2B Quote deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createQuote,
  getQuotes,
  getQuoteById,
  updateQuote,
  deleteQuote,
};
