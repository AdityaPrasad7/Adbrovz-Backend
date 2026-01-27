const Joi = require('joi');
const validate = require('../middlewares/validation.middleware');

// Phone number pattern (general E.164-like: optional +, 6-15 digits)
const phonePattern = /^\+?\d{6,15}$/;

// ======================== USER SIGNUP SCHEMA ========================
const userSignupSchema = Joi.object({
  phoneNumber: Joi.string()
    .pattern(phonePattern)
    .required()
    .messages({
      'string.pattern.base': 'Invalid phone number format.',
      'any.required': 'Phone number is required',
    }),
  name: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name must not exceed 50 characters',
      'any.required': 'Name is required',
    }),
  email: Joi.string()
    .email()
    .optional()
    .messages({
      'string.email': 'Invalid email format',
    }),
  pin: Joi.string()
    .length(4)
    .pattern(/^\d+$/)
    .required()
    .messages({
      'string.length': 'PIN must be exactly 4 digits',
      'string.pattern.base': 'PIN must contain only numbers',
      'any.required': 'PIN is required',
    }),
  confirmPin: Joi.string()
    .valid(Joi.ref('pin'))
    .required()
    .messages({
      'any.only': 'PINs do not match',
      'any.required': 'Confirm PIN is required',
    }),
  acceptedTerms: Joi.boolean()
    .valid(true)
    .required()
    .messages({
      'any.only': 'You must accept Terms & Conditions',
      'any.required': 'Terms & Conditions acceptance is required',
    }),
  acceptedPrivacyPolicy: Joi.boolean()
    .valid(true)
    .required()
    .messages({
      'any.only': 'You must accept Privacy Policy',
      'any.required': 'Privacy Policy acceptance is required',
    }),
});

// ======================== NEW TWO-STEP SIGNUP SCHEMAS ========================
const initiateUserSignupSchema = Joi.object({
  phoneNumber: Joi.string()
    .pattern(phonePattern)
    .required()
    .messages({
      'string.pattern.base': 'Invalid phone number format.',
      'any.required': 'Phone number is required',
    }),
  name: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name must not exceed 50 characters',
      'any.required': 'Name is required',
    }),
  email: Joi.string()
    .email()
    .optional()
    .messages({
      'string.email': 'Invalid email format',
    }),
});

const completeUserSignupSchema = Joi.object({
  signupId: Joi.string()
    .required()
    .messages({
      'any.required': 'Signup ID is required',
    }),
  pin: Joi.string()
    .length(4)
    .pattern(/^\d+$/)
    .required()
    .messages({
      'string.length': 'PIN must be exactly 4 digits',
      'string.pattern.base': 'PIN must contain only numbers',
      'any.required': 'PIN is required',
    }),
  confirmPin: Joi.string()
    .valid(Joi.ref('pin'))
    .required()
    .messages({
      'any.only': 'PINs do not match',
      'any.required': 'Confirm PIN is required',
    }),
  acceptedPolicies: Joi.boolean()
    .valid(true)
    .required()
    .messages({
      'any.only': 'You must accept Terms & Conditions and Privacy Policy',
      'any.required': 'Policy acceptance is required',
    }),
});

const initiateLoginSchema = Joi.object({
  phoneNumber: Joi.string()
    .pattern(phonePattern)
    .required()
    .messages({
      'string.pattern.base': 'Invalid phone number format.',
      'any.required': 'Phone number is required',
    }),
  acceptedPolicies: Joi.boolean()
    .valid(true)
    .required()
    .messages({
      'any.only': 'You must accept Terms & Conditions and Privacy Policy',
      'any.required': 'Policy acceptance is required',
    }),
});

const completeLoginSchema = Joi.object({
  loginId: Joi.string()
    .required()
    .messages({
      'any.required': 'Login ID is required',
    }),
  pin: Joi.string()
    .length(4)
    .pattern(/^\d+$/)
    .required()
    .messages({
      'string.length': 'PIN must be exactly 4 digits',
      'string.pattern.base': 'PIN must contain only numbers',
      'any.required': 'PIN is required',
    }),
});

const verifyResetOTPSchema = Joi.object({
  phoneNumber: Joi.string()
    .pattern(phonePattern)
    .required()
    .messages({
      'string.pattern.base': 'Invalid phone number format.',
      'any.required': 'Phone number is required',
    }),
  otp: Joi.string()
    .length(6)
    .pattern(/^\d+$/)
    .required()
    .messages({
      'string.length': 'OTP must be 6 digits',
      'string.pattern.base': 'OTP must contain only numbers',
      'any.required': 'OTP is required',
    }),
});

const completeResetPinSchema = Joi.object({
  resetId: Joi.string()
    .required()
    .messages({
      'any.required': 'Reset ID is required',
    }),
  newPin: Joi.string()
    .length(4)
    .pattern(/^\d+$/)
    .required()
    .messages({
      'string.length': 'PIN must be exactly 4 digits',
      'string.pattern.base': 'PIN must contain only numbers',
      'any.required': 'New PIN is required',
    }),
  confirmPin: Joi.string()
    .valid(Joi.ref('newPin'))
    .required()
    .messages({
      'any.only': 'PINs do not match',
      'any.required': 'Confirm PIN is required',
    }),
  acceptedPolicies: Joi.boolean()
    .valid(true)
    .required()
    .messages({
      'any.only': 'You must accept Terms & Conditions and Privacy Policy',
      'any.required': 'Policy acceptance is required',
    }),
});

// ======================== VENDOR SIGNUP SCHEMA ========================
const vendorSignupSchema = Joi.object({
  phoneNumber: Joi.string()
    .pattern(phonePattern)
    .required()
    .messages({
      'string.pattern.base': 'Invalid phone number format.',
      'any.required': 'Phone number is required',
    }),
  name: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name must not exceed 50 characters',
      'any.required': 'Name is required',
    }),
  email: Joi.string()
    .email()
    .optional()
    .messages({
      'string.email': 'Invalid email format',
    }),
  pin: Joi.string()
    .length(4)
    .pattern(/^\d+$/)
    .required()
    .messages({
      'string.length': 'PIN must be exactly 4 digits',
      'string.pattern.base': 'PIN must contain only numbers',
      'any.required': 'PIN is required',
    }),
  confirmPin: Joi.string()
    .valid(Joi.ref('pin'))
    .required()
    .messages({
      'any.only': 'PINs do not match',
      'any.required': 'Confirm PIN is required',
    }),
  workState: Joi.string()
    .trim()
    .min(2)
    .required()
    .messages({
      'string.min': 'Work state must be at least 2 characters',
      'any.required': 'Work state is required',
    }),
  workCity: Joi.string()
    .trim()
    .min(2)
    .required()
    .messages({
      'string.min': 'Work city must be at least 2 characters',
      'any.required': 'Work city is required',
    }),
  workPincodes: Joi.array()
    .items(Joi.string().trim())
    .optional()
    .messages({
      'array.base': 'Work pincodes must be an array',
    }),
  acceptedTerms: Joi.boolean()
    .valid(true)
    .required()
    .messages({
      'any.only': 'You must accept Terms & Conditions',
      'any.required': 'Terms & Conditions acceptance is required',
    }),
  acceptedPrivacyPolicy: Joi.boolean()
    .valid(true)
    .required()
    .messages({
      'any.only': 'You must accept Privacy Policy',
      'any.required': 'Privacy Policy acceptance is required',
    }),
});

// ======================== ADMIN SIGNUP SCHEMA ========================
const adminSignupSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.alphanum': 'Username must contain only alphanumeric characters',
      'string.min': 'Username must be at least 3 characters',
      'string.max': 'Username must not exceed 30 characters',
      'any.required': 'Username is required',
    }),
  name: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name must not exceed 50 characters',
      'any.required': 'Name is required',
    }),
  email: Joi.string()
    .email()
    .optional()
    .messages({
      'string.email': 'Invalid email format',
    }),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      'any.required': 'Password is required',
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Confirm password is required',
    }),
});

// ======================== LOGIN SCHEMA ========================
const loginSchema = Joi.object({
  phoneNumber: Joi.string()
    .pattern(phonePattern)
    .required()
    .messages({
      'string.pattern.base': 'Invalid phone number format.',
      'any.required': 'Phone number is required',
    }),
  pin: Joi.string()
    .length(4)
    .pattern(/^\d+$/)
    .required()
    .messages({
      'string.length': 'PIN must be exactly 4 digits',
      'string.pattern.base': 'PIN must contain only numbers',
      'any.required': 'PIN is required',
    }),
});

// ======================== OTP VERIFICATION SCHEMA ========================
const otpSchema = Joi.object({
  phoneNumber: Joi.string()
    .pattern(phonePattern)
    .required()
    .messages({
      'string.pattern.base': 'Invalid phone number format.',
      'any.required': 'Phone number is required',
    }),
  otp: Joi.string()
    .length(6)
    .pattern(/^\d+$/)
    .required()
    .messages({
      'string.length': 'OTP must be 6 digits',
      'string.pattern.base': 'OTP must contain only numbers',
      'any.required': 'OTP is required',
    }),
});

// ======================== RESET PIN SCHEMA ========================
const resetPinSchema = Joi.object({
  phoneNumber: Joi.string()
    .pattern(phonePattern)
    .required()
    .messages({
      'string.pattern.base': 'Invalid phone number format.',
      'any.required': 'Phone number is required',
    }),
  otp: Joi.string()
    .required()
    .messages({
      'any.required': 'OTP is required',
    }),
  newPin: Joi.string()
    .length(4)
    .pattern(/^\d+$/)
    .required()
    .messages({
      'string.length': 'PIN must be exactly 4 digits',
      'string.pattern.base': 'PIN must contain only numbers',
      'any.required': 'New PIN is required',
    }),
  confirmPin: Joi.string()
    .valid(Joi.ref('newPin'))
    .required()
    .messages({
      'any.only': 'PINs do not match',
      'any.required': 'Confirm PIN is required',
    }),
});

// Export validation middlewares
module.exports = {
  validateUserSignup: validate(userSignupSchema, 'body'),
  validateInitiateUserSignup: validate(initiateUserSignupSchema, 'body'),
  validateCompleteUserSignup: validate(completeUserSignupSchema, 'body'),
  validateVendorSignup: validate(vendorSignupSchema, 'body'),
  validateAdminSignup: validate(adminSignupSchema, 'body'),
  validateSignup: validate(userSignupSchema, 'body'), // Backward compatibility
  validateLogin: validate(loginSchema, 'body'),
  validateInitiateLogin: validate(initiateLoginSchema, 'body'),
  validateCompleteLogin: validate(completeLoginSchema, 'body'),
  validateOTP: validate(otpSchema, 'body'),
  validateResetPIN: validate(resetPinSchema, 'body'),
  validateVerifyResetOTP: validate(verifyResetOTPSchema, 'body'),
  validateCompleteResetPIN: validate(completeResetPinSchema, 'body'),
};
