const AuditLog = require('../models/AuditLog.model');

/**
 * Create an audit log entry
 * @param {Object} options - Audit log options
 * @param {string} options.action - Action type (login, logout, etc.)
 * @param {ObjectId} options.userId - User ID who performed the action
 * @param {string} options.userModel - User model type ('User', 'Vendor', 'Admin')
 * @param {Object} options.details - Additional details about the action
 * @param {string} options.ip - IP address
 * @param {string} options.userAgent - User agent string
 */
const createAuditLog = async ({
  action,
  userId,
  userModel,
  details = {},
  ip = null,
  userAgent = null,
}) => {
  try {
    const auditLog = await AuditLog.create({
      action,
      user: userId,
      userModel,
      details,
      ip,
      userAgent,
      timestamp: new Date(),
    });

    return auditLog;
  } catch (error) {
    // Don't throw - audit logging shouldn't break the main flow
    console.error('Failed to create audit log:', error.message);
    return null;
  }
};

/**
 * Get audit logs for a user
 * @param {ObjectId} userId - User ID
 * @param {Object} options - Query options
 * @param {number} options.limit - Number of logs to return
 * @param {number} options.skip - Number of logs to skip
 * @param {string} options.action - Filter by action type
 */
const getUserAuditLogs = async (userId, options = {}) => {
  try {
    const { limit = 50, skip = 0, action } = options;

    const query = { user: userId };
    if (action) {
      query.action = action;
    }

    const logs = await AuditLog.find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    return logs;
  } catch (error) {
    console.error('Failed to get audit logs:', error.message);
    throw error;
  }
};

/**
 * Get audit logs by action type
 * @param {string} action - Action type
 * @param {Object} options - Query options
 */
const getAuditLogsByAction = async (action, options = {}) => {
  try {
    const { limit = 100, skip = 0, startDate, endDate } = options;

    const query = { action };
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const logs = await AuditLog.find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(skip)
      .populate('user', 'name phoneNumber')
      .lean();

    return logs;
  } catch (error) {
    console.error('Failed to get audit logs by action:', error.message);
    throw error;
  }
};

/**
 * Helper to extract IP and UserAgent from request
 * @param {Object} req - Express request object
 */
const getRequestInfo = (req) => {
  return {
    ip: req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']?.split(',')[0],
    userAgent: req.headers['user-agent'] || null,
  };
};

module.exports = {
  createAuditLog,
  getUserAuditLogs,
  getAuditLogsByAction,
  getRequestInfo,
};

