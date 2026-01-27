// Redis/Bull queues are disabled for now (no Redis dependency).
// Expose no-op getters so callers can check for null.

const getNotificationQueue = () => null;
const getSmsQueue = () => null;
const getEmailQueue = () => null;

module.exports = {
  getNotificationQueue,
  getSmsQueue,
  getEmailQueue,
  get notificationQueue() {
    return null;
  },
  get smsQueue() {
    return null;
  },
  get emailQueue() {
    return null;
  },
};

