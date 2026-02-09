const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: [
        'login',
        'logout',
        'booking_created',
        'booking_accepted',
        'booking_cancelled',
        'booking_completed',
        'payment',
        'account_deleted',
        'profile_updated',
        'duty_toggled',
        'user_status_updated',
      ],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'userModel',
    },
    userModel: {
      type: String,
      enum: ['User', 'Vendor', 'Admin'],
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
    },
    ip: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
auditLogSchema.index({ user: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });
auditLogSchema.index({ timestamp: -1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;

