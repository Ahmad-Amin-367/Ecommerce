const ApiError = require('../utils/apiError');

/**
 * Joi validation middleware factory.
 * Validates req.body, req.query, or req.params against a Joi schema.
 *
 * Usage:
 *   router.post('/register', validate(authValidation.register), authController.register)
 *
 * @param {import('joi').Schema} schema - Joi schema to validate against
 * @param {'body'|'query'|'params'} source - Which part of the request to validate
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,   // collect ALL errors, not just the first
      stripUnknown: true,  // remove unknown fields for safety
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/['"]/g, ''),
      }));

      return next(ApiError.badRequest('Validation failed', errors));
    }

    // Replace req[source] with the validated (and stripped) value
    req[source] = value;
    next();
  };
};

module.exports = { validate };
