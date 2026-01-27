const config = require('../config/env');

const generateOTP = (length = 6) => {
  // Static OTP for development
  if (config.NODE_ENV === 'development') {
    return '123456';
  }
  
  // Random OTP for production
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i += 1) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
};

module.exports = {
  generateOTP,
};

