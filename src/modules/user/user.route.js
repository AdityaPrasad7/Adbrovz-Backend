const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const { authenticate } = require('../../middlewares/auth.middleware');
const { validateUpdateProfile } = require('../../validators/user.validator');

// All routes require authentication
router.use(authenticate);

router.get('/profile', userController.getProfile);
router.patch('/profile', validateUpdateProfile, userController.updateProfile);
router.delete('/account', userController.deleteAccount);

module.exports = router;

