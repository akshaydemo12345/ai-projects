'use strict';

const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  getPage,
  updatePage,
  deletePage,
  publishPage,
  unpublishPage,
  captureLead,
  getLeads,
  exportLeadsCsv,
} = require('../controllers/pageController');

const router = express.Router();

// ─── Public Routes (No Auth) ──────────────────────────────────────────────────

/**
 * @route   POST /pages/:id/leads
 * @desc    Capture a lead from a live/published landing page
 */
router.post('/:id/leads', captureLead);


// ─── Protected Routes (Auth Required) ──────────────────────────────────────────

router.use(protect);

/**
 * @route   GET /pages/:id
 * @desc    Get a single page by ID
 */
router.get('/:id', protect, getPage);

/**
 * @route   PUT /pages/:id
 * @desc    Update page content / SEO / title
 */
router.put('/:id', protect, updatePage);

/**
 * @route   DELETE /pages/:id
 * @desc    Delete a page (Soft Delete)
 */
router.delete('/:id', protect, deletePage);

/**
 * @route   POST /pages/:id/publish
 * @desc    Publish a page with optional custom domain or subdomain
 */
router.post('/:id/publish', protect, publishPage);

/**
 * @route   POST /pages/:id/unpublish
 * @desc    Revert a page to draft
 */
router.post('/:id/unpublish', protect, unpublishPage);

/**
 * @route   GET /pages/:id/leads
 * @desc    Get all captured leads for a page
 */
router.get('/:id/leads', protect, getLeads);

/**
 * @route   GET /pages/:id/export-leads
 * @desc    Download all captured leads for a page as a CSV file
 */
router.get('/:id/export-leads', protect, exportLeadsCsv);

module.exports = router;
