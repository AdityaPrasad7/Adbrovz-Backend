const auditService = require('../services/audit.service');

/**
 * Middleware to automatically log specific actions
 * Usage: router.post('/action', auditMiddleware('action_name'), controller.action)
 * 
 * @param {string} action - Action name to log
 * @param {string} userModel - User model type ('User', 'Vendor', 'Admin')
 */
const auditMiddleware = (action, userModel = null) => {
  return async (req, res, next) => {
    // Only log if user is authenticated
    if (req.user && req.user.userId) {
      const { ip, userAgent } = auditService.getRequestInfo(req);
      
      // Determine user model type
      let modelType = userModel;
      if (!modelType && req.user.role) {
        if (req.user.role === 'admin' || req.user.role === 'super_admin') {
          modelType = 'Admin';
        } else if (req.user.role === 'vendor') {
          modelType = 'Vendor';
        } else {
          modelType = 'User';
        }
      }

      // Log asynchronously (don't block request)
      auditService.createAuditLog({
        action,
        userId: req.user.userId,
        userModel: modelType || 'User',
        details: {
          method: req.method,
          path: req.path,
          ...req.body, // Include request body details
        },
        ip,
        userAgent,
      }).catch((err) => {
        // Silently fail - don't break the request
        console.error('Audit log failed:', err.message);
      });
    }

    next();
  };
};

module.exports = auditMiddleware;

