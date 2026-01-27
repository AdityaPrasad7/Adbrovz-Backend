const axios = require('axios');
const config = require('../config/env');
const { getSmsQueue } = require('../workers/queue.worker');

// SMS Country integration
const sendSMS = async (phoneNumber, message) => {
  try {
    const smsQueue = getSmsQueue();
    
    if (!smsQueue) {
      console.warn('SMS queue not available (Redis may not be running). SMS will not be sent.');
      // In development, you might want to log the SMS instead
      console.log(`[DEV] SMS would be sent to ${phoneNumber}: ${message}`);
      return { success: false, message: 'SMS queue not available' };
    }

    // TODO: Implement SMS Country API integration
    // For now, add to queue
    await smsQueue.add({
      phoneNumber,
      message,
    });

    console.log(`SMS queued for ${phoneNumber}`);
    return { success: true, message: 'SMS queued successfully' };
  } catch (error) {
    console.error(`SMS sending failed: ${error.message}`);
    throw error;
  }
};

const sendOTP = async (phoneNumber, otp) => {
  const message = `Your AdBrovz OTP is ${otp}. Valid for 10 minutes. Do not share this OTP with anyone.`;
  return sendSMS(phoneNumber, message);
};

module.exports = {
  sendSMS,
  sendOTP,
};

