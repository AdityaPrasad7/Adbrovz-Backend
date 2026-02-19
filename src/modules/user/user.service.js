const User = require('../../models/User.model');
const ApiError = require('../../utils/ApiError');
const MESSAGES = require('../../constants/messages');
const auditService = require('../../services/audit.service');
const Booking = require('../../models/Booking.model');
const Notification = require('../../models/Notification.model');
const Dispute = require('../../models/Dispute.model');
const AuditLog = require('../../models/AuditLog.model');

const getUserById = async (userId) => {
  const user = await User.findById(userId).select('-pin -failedAttempts -lockUntil');
  if (!user) {
    throw new ApiError(404, MESSAGES.USER.NOT_FOUND);
  }

  return {
    id: user._id,
    image: user.photo || '',
    name: user.name,
    mobileNumber: user.phoneNumber,
    mail: user.email,
    address: user.address || '',
    city: user.city || '',
    state: user.state || '',
    zipcode: user.zipcode || '',
    country: user.country || 'India',
    coins: user.coins || 0,
    userID: user.userID,
    status: user.status
  };
};

const updateUser = async (userId, updateData, req = null) => {
  const allowedUpdates = ['name', 'email', 'photo', 'image', 'address', 'city', 'state', 'zipcode', 'country', 'mobileNumber'];
  const updates = Object.keys(updateData);
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    throw new ApiError(400, 'Invalid updates');
  }

  // Map image/photo and mobileNumber to phoneNumber if provided
  if (updateData.image) {
    updateData.photo = updateData.image;
    delete updateData.image;
  }

  if (updateData.mobileNumber) {
    updateData.phoneNumber = updateData.mobileNumber;
    delete updateData.mobileNumber;
  }

  console.log('DEBUG: updateUser Service Data:', { userId, updateData });

  const user = await User.findByIdAndUpdate(
    userId,
    updateData,
    { new: true, runValidators: true }
  ).select('-pin -failedAttempts -lockUntil');

  if (!user) {
    throw new ApiError(404, MESSAGES.USER.NOT_FOUND);
  }

  const result = await getUserById(userId);
  console.log('DEBUG: updateUser Service Result:', result);
  return result;
};

const deleteUser = async (userId, req = null) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, MESSAGES.USER.NOT_FOUND);
  }

  // Audit log - Account deleted (before deletion)
  if (req) {
    const { ip, userAgent } = auditService.getRequestInfo(req);
    await auditService.createAuditLog({
      action: 'account_deleted',
      userId: user._id,
      userModel: 'User',
      details: {
        phoneNumber: user.phoneNumber,
        userID: user.userID,
        deletedAt: new Date(),
      },
      ip,
      userAgent,
    });
  }

  // Delete related data (personal data cleanup)
  await Promise.all([
    Booking.deleteMany({ user: userId }),
    Notification.deleteMany({ user: userId }),
    Dispute.deleteMany({ user: userId }),
    AuditLog.deleteMany({ user: userId, userModel: 'User' })
  ]);

  // Finally delete the user
  await User.findByIdAndDelete(userId);

  return user;
};

module.exports = {
  getUserById,
  updateUser,
  deleteUser,

};

