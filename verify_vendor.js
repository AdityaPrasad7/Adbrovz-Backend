const mongoose = require('mongoose');
const config = require('./src/config/env');
const Vendor = require('./src/models/Vendor.model');

const verifyVendor = async () => {
    try {
        await mongoose.connect(config.MONGODB_URI);
        const vendorId = process.argv[2];

        const vendor = await Vendor.findByIdAndUpdate(vendorId, { isVerified: true, isOnline: true }, { new: true });
        if (vendor) {
            console.log(`Vendor ${vendorId} is now verified and online!`);
        } else {
            console.log(`Vendor ${vendorId} not found.`);
        }
    } catch (e) {
        console.error(e);
    } finally {
        mongoose.connection.close();
        process.exit(0);
    }
};

verifyVendor();
