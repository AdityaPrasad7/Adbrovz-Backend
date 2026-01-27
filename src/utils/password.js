const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

const hashPIN = async (pin) => {
  // PIN is 4 digits, we still hash it for security
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(pin.toString(), salt);
};

const comparePIN = async (enteredPIN, hashedPIN) => {
  if (!enteredPIN || !hashedPIN) {
    throw new ApiError(400, 'Invalid PIN comparison data');
  }
  return await bcrypt.compare(enteredPIN, hashedPIN);
};


module.exports = {
  hashPassword,
  comparePassword,
  hashPIN,
  comparePIN,
};

