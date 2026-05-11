'use strict';

const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  getMe,
  updateProfile,
  changePassword,
  getCredits,
  upgradePlan,
  getDashboard,
  deleteAccount,
} = require('../controllers/userController');

const router = express.Router();

// All user routes require authentication
router.use(protect);

/**
 * @route   GET /user/me
 * @route   GET /user/profile
 * @desc    Get current authenticated user's full profile
 */
router.get('/me', getMe);
router.get('/profile', getMe);

/**
 * @route   GET /user/dashboard
 * @desc    Get dashboard data: stats + recent pages
 */
router.get('/dashboard', getDashboard);

/**
 * @route   PATCH /user/update-profile
 * @desc    Update name or avatar
 * @body    { name?, avatar? }
 */
router.patch('/update-profile', updateProfile);

/**
 * @route   PATCH /user/change-password
 * @desc    Change password (requires current password)
 * @body    { currentPassword, newPassword }
 */
router.patch('/change-password', changePassword);

/**
 * @route   GET /user/credits
 * @desc    Get current credit balance and plan
 */
router.get('/credits', getCredits);

/**
 * @route   POST /user/upgrade-plan
 * @desc    Upgrade or downgrade subscription plan
 * @body    { plan: 'free' | 'pro' | 'enterprise' }
 */
router.post('/upgrade-plan', upgradePlan);

/**
 * @route   DELETE /user/account
 * @desc    Permanently delete account and all pages
 * @body    { password }
 */
router.delete('/account', deleteAccount);

module.exports = router;
