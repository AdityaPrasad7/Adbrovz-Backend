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

const getAllUsers = async (query = {}) => {
  const { limit = 10, skip = 0, search = '', includeDeleted = false } = query;

  // Build filter - include deleted users if requested (for exports)
  const filter = {};
  
  // Only filter out deleted users if includeDeleted is not true
  // This allows exports to show all users including deleted ones
  if (includeDeleted !== 'true' && includeDeleted !== true) {
    filter.deletedAt = null;
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phoneNumber: { $regex: search, $options: 'i' } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip)),
    User.countDocuments(filter),
  ]);

  return {
    users,
    total,
    limit: parseInt(limit),
    skip: parseInt(skip),
  };
};

const updateUserStatus = async (userId, status, adminId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const oldStatus = user.status || (user.isActive ? 'ACTIVE' : 'SUSPENDED');
  user.status = status;
  user.isActive = (status === 'ACTIVE');
  await user.save();

  // Log the action
  try {
    await AuditLog.create({
      user: adminId,
      userModel: 'Admin',
      action: 'user_status_updated',
      details: {
        targetUser: userId,
        oldStatus,
        newStatus: status
      }
    });
  } catch (logError) {
    console.error('Audit logging failed:', logError.message);
    // Don't fail the primary action (status update) if logging fails
  }

  return user;
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
};
