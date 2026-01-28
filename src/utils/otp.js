const generateOTP = (length = 6) => {
  // Hardcoded for development phase as per user request
  return '123456';

  /* Original logic:
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i += 1) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
  */
};

module.exports = {
  generateOTP,
};

