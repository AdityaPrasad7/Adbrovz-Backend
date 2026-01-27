# Validation with Joi

This project uses **Joi** for schema validation instead of express-validator.

## How It Works

### 1. Validation Middleware (`validation.middleware.js`)

The `validate` middleware function:
- Takes a Joi schema and source ('body', 'query', or 'params')
- Validates the request data
- Returns 400 error with validation messages if invalid
- Replaces request data with validated/sanitized values

### 2. Validator Files

Each validator file exports validation middleware functions:
- `auth.validator.js` - Authentication validations
- `user.validator.js` - User profile validations

### 3. Usage in Routes

```javascript
const { validateSignup } = require('../../validators/auth.validator');

router.post('/signup', validateSignup, controller.signup);
```

## Example Schema

```javascript
const Joi = require('joi');

const signupSchema = Joi.object({
  phoneNumber: Joi.string()
    .pattern(/^(\+91|91)?[6-9]\d{9}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid phone number format',
      'any.required': 'Phone number is required',
    }),
  name: Joi.string()
    .min(2)
    .max(50)
    .required(),
  pin: Joi.string()
    .length(4)
    .pattern(/^\d+$/)
    .required(),
});

module.exports = {
  validateSignup: validate(signupSchema, 'body'),
};
```

## Features

- ✅ Schema-based validation
- ✅ Custom error messages
- ✅ Automatic sanitization (stripUnknown)
- ✅ Type coercion
- ✅ Pattern matching
- ✅ Reference validation (e.g., confirmPin must match pin)

## Error Response

When validation fails:
```json
{
  "success": false,
  "message": "Phone number is required, PIN must be exactly 4 digits"
}
```

