/**
 * EXAMPLES: How to use AuditLog in your services
 * 
 * This file shows examples - you can delete it after reading
 */

const auditService = require('./audit.service');

// ============================================
// EXAMPLE 1: Logging in a service
// ============================================

// In booking.service.js
const createBooking = async (userId, bookingData, req) => {
  // ... create booking logic ...
  
  const booking = await Booking.create(bookingData);
  
  // Log the action
  const { ip, userAgent } = auditService.getRequestInfo(req);
  await auditService.createAuditLog({
    action: 'booking_created',
    userId: userId,
    userModel: 'User',
    details: {
      bookingId: booking._id,
      serviceCount: booking.services.length,
      totalAmount: booking.pricing.totalPrice,
      scheduledDate: booking.scheduledDate,
    },
    ip,
    userAgent,
  });
  
  return booking;
};

// ============================================
// EXAMPLE 2: Using audit middleware
// ============================================

// In booking.route.js
const auditMiddleware = require('../middlewares/audit.middleware');

// Automatically logs 'booking_created' action
router.post('/create', authenticate, auditMiddleware('booking_created'), bookingController.create);

// ============================================
// EXAMPLE 3: Logging payment
// ============================================

// In payment.service.js
const processPayment = async (bookingId, paymentData, req) => {
  // ... process payment ...
  
  await auditService.createAuditLog({
    action: 'payment',
    userId: req.user.userId,
    userModel: 'User',
    details: {
      bookingId: bookingId,
      amount: paymentData.amount,
      method: paymentData.method,
      razorpayOrderId: paymentData.razorpayOrderId,
      status: 'completed',
    },
    ip: req.ip,
    userAgent: req.headers['user-agent'],
  });
};

// ============================================
// EXAMPLE 4: Querying audit logs (Admin)
// ============================================

// Get all logins in last 24 hours
const recentLogins = await auditService.getAuditLogsByAction('login', {
  startDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
  limit: 100,
});

// Get all actions by a specific user
const userActions = await auditService.getUserAuditLogs(userId, {
  limit: 50,
  action: 'booking_created', // Optional filter
});

// ============================================
// EXAMPLE 5: Vendor duty toggle
// ============================================

// In vendor.service.js
const toggleDuty = async (vendorId, dutyStatus, req) => {
  // ... toggle duty logic ...
  
  await auditService.createAuditLog({
    action: 'duty_toggled',
    userId: vendorId,
    userModel: 'Vendor',
    details: {
      dutyStatus: dutyStatus ? 'ON' : 'OFF',
      location: req.body.location, // GPS coordinates
    },
    ip: req.ip,
    userAgent: req.headers['user-agent'],
  });
};

