const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const ApiError = require('../../utils/ApiError');
const authService = require('./auth.service');
const MESSAGES = require('../../constants/messages');

// User Signup
const userSignup = asyncHandler(async (req, res) => {
  const { phoneNumber, name, email, pin, confirmPin, acceptedPolicies } = req.body;

  const result = await authService.userSignup({
    phoneNumber,
    name,
    email,
    pin,
    confirmPin,
    acceptedPolicies,
  });

  res.status(201).json(
    new ApiResponse(201, result, 'User registered successfully. OTP sent to your phone.')
  );
});

// User Initiate Signup (Step 1)
const userInitiateSignup = asyncHandler(async (req, res) => {
  const { phoneNumber, name, email } = req.body;

  const result = await authService.initiateUserSignup({
    phoneNumber,
    name,
    email,
  });

  res.status(200).json(
    new ApiResponse(200, result, 'Signup initiated successfully.')
  );
});

// User Complete Signup (Step 2)
const userCompleteSignup = asyncHandler(async (req, res) => {
  const { signupId, pin, confirmPin, acceptedPolicies } = req.body;

  const result = await authService.completeUserSignup({
    signupId,
    pin,
    confirmPin,
    acceptedPolicies,
  }, req);

  res.status(200).json(
    new ApiResponse(200, result, 'Details submitted. OTP sent to your phone.')
  );
});

// Vendor Signup
const vendorSignup = asyncHandler(async (req, res) => {
  const { phoneNumber, name, email, pin, confirmPin, workState, workCity, workPincodes, acceptedTerms, acceptedPrivacyPolicy } = req.body;

  const result = await authService.vendorSignup({
    phoneNumber,
    name,
    email,
    pin,
    confirmPin,
    workState,
    workCity,
    workPincodes,
    acceptedTerms,
    acceptedPrivacyPolicy,
  });

  res.status(201).json(
    new ApiResponse(201, result, 'Vendor registered successfully. OTP sent to your phone.')
  );
});

// Admin Signup (Super Admin Only)
const adminSignup = asyncHandler(async (req, res) => {
  const { username, name, email, password, confirmPassword } = req.body;

  const result = await authService.adminSignup({
    username,
    name,
    email,
    password,
    confirmPassword,
  });

  res.status(201).json(
    new ApiResponse(201, result, 'Admin registered successfully.')
  );
});

// ======================== USER HANDLERS ========================
const userVerifyOTP = asyncHandler(async (req, res) => {
  const { phoneNumber, otp } = req.body;

  const result = await authService.verifySignupOTP(phoneNumber, otp, 'user', req);

  res.status(200).json(
    new ApiResponse(200, result, 'User verified successfully')
  );
});

const userLogin = asyncHandler(async (req, res) => {
  const { phoneNumber, pin } = req.body;

  const result = await authService.login(phoneNumber, pin, 'user', req);

  res.status(200).json(
    new ApiResponse(200, result, MESSAGES.AUTH.LOGIN_SUCCESS)
  );
});

// User Initiate Login (Screen 1)
const userInitiateLogin = asyncHandler(async (req, res) => {
  const { phoneNumber, acceptedPolicies } = req.body;

  const result = await authService.initiateUserLogin({
    phoneNumber,
    acceptedPolicies
  });

  res.status(200).json(
    new ApiResponse(200, result, 'User verified. Please enter your PIN.')
  );
});

// User Complete Login (Screen 2)
const userCompleteLogin = asyncHandler(async (req, res) => {
  const { loginId, pin } = req.body;

  const result = await authService.completeUserLogin({
    loginId,
    pin
  }, req);

  res.status(200).json(
    new ApiResponse(200, result, MESSAGES.AUTH.LOGIN_SUCCESS)
  );
});

const userSendOTP = asyncHandler(async (req, res) => {
  const { phoneNumber } = req.body;

  await authService.sendOTP(phoneNumber, 'user');

  res.status(200).json(
    new ApiResponse(200, null, MESSAGES.AUTH.OTP_SENT)
  );
});

const userResetPIN = asyncHandler(async (req, res) => {
  const { phoneNumber, otp, newPin, confirmPin } = req.body;

  await authService.resetPIN(phoneNumber, otp, newPin, confirmPin, 'user', req);

  res.status(200).json(
    new ApiResponse(200, null, 'PIN reset successfully')
  );
});

// User Verify Reset OTP (Step 2)
const userVerifyResetOTP = asyncHandler(async (req, res) => {
  const { phoneNumber, otp } = req.body;

  const result = await authService.verifyResetPINOTP({
    phoneNumber,
    otp
  });

  res.status(200).json(
    new ApiResponse(200, result, 'OTP verified. Please set your new PIN.')
  );
});

// User Complete Reset PIN (Step 3)
const userCompleteResetPIN = asyncHandler(async (req, res) => {
  const { resetId, newPin, confirmPin, acceptedPolicies } = req.body;

  const result = await authService.completeResetPIN({
    resetId,
    newPin,
    confirmPin,
    acceptedPolicies
  }, req);

  res.status(200).json(
    new ApiResponse(200, result, 'PIN reset successfully.')
  );
});

const userLogout = asyncHandler(async (req, res) => {
  const auditService = require('../../services/audit.service');

  // Audit log - User Logout
  if (req.user && req.user.userId) {
    const { ip, userAgent } = auditService.getRequestInfo(req);
    await auditService.createAuditLog({
      action: 'logout',
      userId: req.user.userId,
      userModel: 'User',
      details: {
        logoutMethod: 'manual',
      },
      ip,
      userAgent,
    });
  }

  res.status(200).json(
    new ApiResponse(200, null, MESSAGES.AUTH.LOGOUT_SUCCESS)
  );
});

// ======================== VENDOR HANDLERS ========================
const vendorVerifyOTP = asyncHandler(async (req, res) => {
  const { phoneNumber, otp } = req.body;

  const result = await authService.verifySignupOTP(phoneNumber, otp, 'vendor', req);

  res.status(200).json(
    new ApiResponse(200, result, 'Vendor verified successfully')
  );
});

const vendorLogin = asyncHandler(async (req, res) => {
  const { phoneNumber, pin } = req.body;

  const result = await authService.login(phoneNumber, pin, 'vendor', req);

  res.status(200).json(
    new ApiResponse(200, result, MESSAGES.AUTH.LOGIN_SUCCESS)
  );
});

const vendorSendOTP = asyncHandler(async (req, res) => {
  const { phoneNumber } = req.body;

  await authService.sendOTP(phoneNumber, 'vendor');

  res.status(200).json(
    new ApiResponse(200, null, MESSAGES.AUTH.OTP_SENT)
  );
});

const vendorResetPIN = asyncHandler(async (req, res) => {
  const { phoneNumber, otp, newPin, confirmPin } = req.body;

  await authService.resetPIN(phoneNumber, otp, newPin, confirmPin, 'vendor', req);

  res.status(200).json(
    new ApiResponse(200, null, 'PIN reset successfully')
  );
});

const vendorLogout = asyncHandler(async (req, res) => {
  const auditService = require('../../services/audit.service');

  // Audit log - Vendor Logout
  if (req.user && req.user.userId) {
    const { ip, userAgent } = auditService.getRequestInfo(req);
    await auditService.createAuditLog({
      action: 'logout',
      userId: req.user.userId,
      userModel: 'Vendor',
      details: {
        logoutMethod: 'manual',
      },
      ip,
      userAgent,
    });
  }

  res.status(200).json(
    new ApiResponse(200, null, MESSAGES.AUTH.LOGOUT_SUCCESS)
  );
});

// ======================== ADMIN HANDLERS ========================
const adminLogout = asyncHandler(async (req, res) => {
  const auditService = require('../../services/audit.service');

  // Audit log - Admin Logout
  if (req.user && req.user.userId) {
    const { ip, userAgent } = auditService.getRequestInfo(req);
    await auditService.createAuditLog({
      action: 'logout',
      userId: req.user.userId,
      userModel: 'Admin',
      details: {
        logoutMethod: 'manual',
      },
      ip,
      userAgent,
    });
  }

  res.status(200).json(
    new ApiResponse(200, null, 'Logout successful')
  );
});

// ======================== GENERIC HANDLERS (Backward Compatibility) ========================
// These auto-detect the role
const verifyOTP = asyncHandler(async (req, res) => {
  const { phoneNumber, otp } = req.body;

  const result = await authService.verifySignupOTP(phoneNumber, otp, 'user', req);

  res.status(200).json(
    new ApiResponse(200, result, MESSAGES.AUTH.OTP_SENT)
  );
});

const login = asyncHandler(async (req, res) => {
  const { phoneNumber, pin } = req.body;

  const result = await authService.login(phoneNumber, pin, 'user', req);

  res.status(200).json(
    new ApiResponse(200, result, MESSAGES.AUTH.LOGIN_SUCCESS)
  );
});

const sendOTP = asyncHandler(async (req, res) => {
  const { phoneNumber } = req.body;

  await authService.sendOTP(phoneNumber, 'user');

  res.status(200).json(
    new ApiResponse(200, null, MESSAGES.AUTH.OTP_SENT)
  );
});

const resetPIN = asyncHandler(async (req, res) => {
  const { phoneNumber, otp, newPin, confirmPin } = req.body;

  await authService.resetPIN(phoneNumber, otp, newPin, confirmPin, 'user', req);

  res.status(200).json(
    new ApiResponse(200, null, 'PIN reset successfully')
  );
});

const logout = asyncHandler(async (req, res) => {
  const auditService = require('../../services/audit.service');

  // Audit log - Logout
  if (req.user && req.user.userId) {
    const { ip, userAgent } = auditService.getRequestInfo(req);
    await auditService.createAuditLog({
      action: 'logout',
      userId: req.user.userId,
      userModel: req.user.role === 'admin' ? 'Admin' : req.user.role === 'vendor' ? 'Vendor' : 'User',
      details: {
        logoutMethod: 'manual',
      },
      ip,
      userAgent,
    });
  }

  // TODO: Implement token blacklisting if needed
  res.status(200).json(
    new ApiResponse(200, null, MESSAGES.AUTH.LOGOUT_SUCCESS)
  );
});

// Refresh token
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  const result = await authService.refreshToken(refreshToken);

  res.status(200).json(
    new ApiResponse(200, result, 'Token refreshed successfully')
  );
});

module.exports = {
  // Signup
  userSignup,
  userInitiateSignup,
  userCompleteSignup,
  vendorSignup,
  adminSignup,

  // User handlers
  userVerifyOTP,
  userLogin,
  userInitiateLogin,
  userCompleteLogin,
  userSendOTP,
  userResetPIN,
  userVerifyResetOTP,
  userCompleteResetPIN,
  userLogout,

  // Vendor handlers
  vendorVerifyOTP,
  vendorLogin,
  vendorSendOTP,
  vendorResetPIN,
  vendorLogout,

  // Admin handlers
  adminLogout,

  // Generic handlers (backward compatibility)
  verifyOTP,
  login,
  sendOTP,
  resetPIN,
  logout,
  refreshToken,
};

