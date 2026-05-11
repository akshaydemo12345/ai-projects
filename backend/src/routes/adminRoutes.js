'use strict';

const express = require('express');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
  getStats,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllPages,
  deletePage,
} = require('../controllers/adminController');

const router = express.Router();

// All admin routes require authentication AND 'admin' role
router.use(protect, restrictTo('admin'));

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
/**
 * @route   GET /admin/stats
 * @desc    Get platform-wide statistics for the admin dashboard
 */
router.get('/stats', getStats);

// ─── User Management ──────────────────────────────────────────────────────────
/**
 * @route   GET /admin/users
 * @desc    Get all users (paginated, searchable, filterable by plan)
 */
router.get('/users', getAllUsers);

/**
 * @route   GET /admin/users/:id
 * @desc    Get a single user along with their pages
 */
router.get('/users/:id', getUserById);

/**
 * @route   PATCH /admin/users/:id
 * @desc    Update user details (role, plan, credits)
 */
router.patch('/users/:id', updateUser);

/**
 * @route   DELETE /admin/users/:id
 * @desc    Permanently delete a user and all their pages
 */
router.delete('/users/:id', deleteUser);

// ─── Page Management ──────────────────────────────────────────────────────────
/**
 * @route   GET /admin/pages
 * @desc    Get all pages across the platform (paginated, searchable, filterable by status)
 */
router.get('/pages', getAllPages);

/**
 * @route   DELETE /admin/pages/:id
 * @desc    Force delete any page
 */
router.delete('/pages/:id', deletePage);

module.exports = router;
