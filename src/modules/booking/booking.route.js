const express = require('express');
const router = express.Router();
const bookingController = require('./booking.controller');
const { authenticate } = require('../../middlewares/auth.middleware');

// In testing mode, we might want to bypass auth or use a mock user
// Using authenticate for production-ready code
router.post('/', authenticate, bookingController.createBooking);
router.get('/my-bookings', authenticate, bookingController.getMyBookings);
router.post('/:id/cancel', authenticate, bookingController.cancelBooking);
router.post('/:id/reschedule', authenticate, bookingController.rescheduleBooking);
router.post('/:id/retry-search', authenticate, bookingController.retrySearch);

module.exports = router;

