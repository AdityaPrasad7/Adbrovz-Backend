const Joi = require('joi');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Validates request data against Joi schema
 * @param {Joi.Schema} schema - Joi validation schema
 * @param {string} source - Where to get data from: 'body', 'query', 'params'
 */
const validate = (schema, source = 'body') => {
  return asyncHandler(async (req, res, next) => {
    if (req.url.includes('/vendors/signup')) {
      console.log(`[DEBUG] Validating ${req.url} [${source}]:`, JSON.stringify(req[source], null, 2));
    }
    const { error, value } = schema.validate(req[source], {
      abortEarly: false, // Return all errors, not just the first one
      stripUnknown: true, // Remove unknown fields
      allowUnknown: false, // Don't allow unknown fields
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message).join(', ');
      throw new ApiError(400, errorMessages);
    }

    // Replace req[source] with validated and sanitized value
    req[source] = value;
    next();
  });
};

module.exports = validate;

