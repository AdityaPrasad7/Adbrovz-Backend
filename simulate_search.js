const mongoose = require('mongoose');
const config = require('./src/config/env');
const Vendor = require('./src/models/Vendor.model');

const simulateBroadcast = async () => {
    try {
        await mongoose.connect(config.MONGODB_URI);
        const serviceIds = ['698d6161062acc2aae63baeb'];

        const query = {
            isOnline: true,
            isActive: true,
            isVerified: true,
            isSuspended: false,
            isBlocked: false,
            selectedServices: { $in: serviceIds }
        };

        console.log("Querying for vendors:", JSON.stringify(query, null, 2));

        const vendors = await Vendor.find(query).select('_id');

        console.log(`Found ${vendors.length} vendors matching the criteria:`);
        vendors.forEach(v => console.log(v._id));

        console.log("Attempting WebSocket Broadcast through server...");
        const io = require('socket.io-client');
        const socket = io('http://localhost:4000');
        socket.on('connect', () => {
            console.log("Simulator connected to websocket to listen for emits...");
            socket.emit('test_broadcast', { bookingId: "TEST_1", services: serviceIds });
            setTimeout(() => process.exit(0), 1000);
        });

    } catch (e) {
        console.error(e);
    } finally {
        mongoose.connection.close();
        process.exit(0);
    }
};

simulateBroadcast();
