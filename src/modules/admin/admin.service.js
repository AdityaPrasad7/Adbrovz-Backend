const AuditLog = require('../../models/AuditLog.model');
const User = require('../../models/User.model');
const Vendor = require('../../models/Vendor.model');
const Booking = require('../../models/Booking.model');

// Placeholder admin service
const getDashboardStats = async () => {
  try {
    const [
      totalUsers,
      totalVendors,
      totalBookings,
      recentLogins,
      recentPayments,
    ] = await Promise.all([
      User.countDocuments({ isActive: true }),
      Vendor.countDocuments({ isActive: true, isVerified: true }),
      Booking.countDocuments(),
      AuditLog.countDocuments({ action: 'login', timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }),
      AuditLog.countDocuments({ action: 'payment', timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }),
    ]);

    return {
      totalUsers,
      totalVendors,
      totalBookings,
      recentLogins,
      recentPayments,
    };
  } catch (error) {
    console.error('Failed to get dashboard stats:', error.message);
    return {
      totalUsers: 0,
      totalVendors: 0,
      totalBookings: 0,
      recentLogins: 0,
      recentPayments: 0,
    };
  }
};

module.exports = {
  getDashboardStats,
};
