const mongoose = require('mongoose');
const config = require('../../config/env');

// Placeholder for seeder runner
const runSeeders = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('Running seeders...');
    // TODO: Implement seeder logic
    console.log('Seeders completed');
    process.exit(0);
  } catch (error) {
    console.error(`Seeder failed: ${error.message}`);
    process.exit(1);
  }
};

if (require.main === module) {
  runSeeders();
}

module.exports = { runSeeders };

