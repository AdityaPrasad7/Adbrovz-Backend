const mongoose = require('mongoose');
const config = require('./src/config/env');
const Vendor = require('./src/models/Vendor.model');

const checkVendor = async () => {
    try {
        await mongoose.connect(config.MONGODB_URI);
        const vendorId = process.argv[2];
        const serviceId = process.argv[3];

        console.log(`Checking vendor ${vendorId}...`);
        const vendor = await Vendor.findById(vendorId);

        if (!vendor) {
            console.log("Vendor not found!");
            process.exit(0);
        }

        console.log("Vendor found:");
        console.log("- isOnline:", vendor.isOnline);
        console.log("- isActive:", vendor.isActive);
        console.log("- isVerified:", vendor.isVerified);
        console.log("- isSuspended:", vendor.isSuspended);
        console.log("- isBlocked:", vendor.isBlocked);

        console.log("- selectedServices (ObjectIds):", vendor.selectedServices.map(s => s.toString()));
        console.log("- Checking if serviceId matches:");
        console.log("  ServiceId requested:", serviceId);

        const hasService = vendor.selectedServices.some(s => s.toString() === serviceId);
        console.log("  Match:", hasService);

        // Also check dutyStatus (if they use that instead of isOnline)
        if (vendor.dutyStatus) {
            console.log("- dutyStatus.isOn:", vendor.dutyStatus.isOn);
        }

    } catch (e) {
        console.error(e);
    } finally {
        mongoose.connection.close();
        process.exit(0);
    }
};

checkVendor();
