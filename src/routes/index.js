const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('../modules/auth/auth.route');
const userRoutes = require('../modules/user/user.route');
const adminRoutes = require('../modules/admin/admin.route');
// const vendorRoutes = require('../modules/vendor/vendor.route');
// const bookingRoutes = require('../modules/booking/booking.route');
// const serviceRoutes = require('../modules/service/service.route');

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);
// router.use('/vendors', vendorRoutes);
// router.use('/bookings', bookingRoutes);
// router.use('/services', serviceRoutes);

module.exports = router;

