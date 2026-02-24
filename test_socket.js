const io = require('socket.io-client');
require('dotenv').config({ path: './.env' });
const port = process.env.PORT || 4000;

console.log(`Trying to connect to http://localhost:${port}`);
const socket = io(`http://localhost:${port}`);

socket.on('connect', () => {
    console.log('✅ Connected to WebSocker server!');

    // Register a mock vendor
    const mockVendorId = '65432101234567890abcdef0';
    socket.emit('register_vendor', mockVendorId);
    console.log(`Sent register_vendor for ${mockVendorId}`);
});

socket.on('new_booking_request', (data) => {
    console.log('📬 Received new booking request:', data);

    // Optional: Simulate accept, reject, or later here
    console.log('Disconnecting in 2 seconds...');
    setTimeout(() => {
        socket.disconnect();
    }, 2000);
});

socket.on('disconnect', () => {
    console.log('🔴 Disconnected from server');
});

socket.on('connect_error', (error) => {
    console.log('❌ Connection Error:', error.message);
});

setTimeout(() => {
    if (socket.connected) {
        socket.disconnect();
    }
    process.exit(0);
}, 5000);
