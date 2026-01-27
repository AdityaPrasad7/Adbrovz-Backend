const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const ApiError = require('../../utils/ApiError');
const userService = require('./user.service');
const MESSAGES = require('../../constants/messages');

// Get user profile
const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const user = await userService.getUserById(userId);

  res.status(200).json(
    new ApiResponse(200, user, 'Profile retrieved successfully')
  );
});

// Update user profile
const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const updateData = req.body;
  
  const user = await userService.updateUser(userId, updateData, req);

  res.status(200).json(
    new ApiResponse(200, user, MESSAGES.USER.PROFILE_UPDATED)
  );
});

// Delete user account
const deleteAccount = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  
  await userService.deleteUser(userId, req);

  res.status(200).json(
    new ApiResponse(200, null, MESSAGES.USER.DELETED)
  );
});

module.exports = {
  getProfile,
  updateProfile,
  deleteAccount,
};

