// Email service placeholder
// Can be integrated with services like SendGrid, AWS SES, etc.

const sendEmail = async (to, subject, html, text) => {
  try {
    // TODO: Implement email sending logic
    console.log(`Email would be sent to ${to} with subject: ${subject}`);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error(`Email sending failed: ${error.message}`);
    throw error;
  }
};

const sendOTPEmail = async (to, otp) => {
  const subject = 'Your AdBrovz OTP';
  const html = `
    <div>
      <h2>Your OTP Code</h2>
      <p>Your OTP code is: <strong>${otp}</strong></p>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this code, please ignore this email.</p>
    </div>
  `;
  return sendEmail(to, subject, html);
};

module.exports = {
  sendEmail,
  sendOTPEmail,
};

