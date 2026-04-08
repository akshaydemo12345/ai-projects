'use strict';

const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  getMyPages,
  getPage,
  createPage,
  updatePage,
  deletePage,
  publishPage,
  unpublishPage,
  captureLead,
  getLeads,
  exportLeadsCsv,
} = require('../controllers/pageController');

const router = express.Router();

// ─── Protected Routes (JWT required) ──────────────────────────────────────────

/**
 * @route   GET /pages
 * @desc    Get all pages for the authenticated user (paginated, filterable)
 * @access  Private
 * @query   ?status=draft|published&page=1&limit=10
 */
router.get('/', protect, getMyPages);

/**
 * @route   GET /pages/:id
 * @desc    Get a single page by ID
 * @access  Private
 */
router.get('/:id', protect, getPage);

/**
 * @route   POST /pages
 * @desc    Create a new landing page (draft)
 * @access  Private
 * @body    { title, slug?, template?, content? }
 */
router.post('/', protect, createPage);

/**
 * @route   PUT /pages/:id
 * @desc    Update page content / SEO / title
 * @access  Private
 * @body    { title?, content?, seo? }
 */
router.put('/:id', protect, updatePage);

/**
 * @route   DELETE /pages/:id
 * @desc    Delete a page permanently
 * @access  Private
 */
router.delete('/:id', protect, deletePage);

/**
 * @route   POST /pages/:id/publish
 * @desc    Publish a page with optional custom domain or subdomain
 * @access  Private
 * @body    { domain?, subdomain? }
 */
router.post('/:id/publish', protect, publishPage);

/**
 * @route   POST /pages/:id/unpublish
 * @desc    Revert a page to draft
 * @access  Private
 */
router.post('/:id/unpublish', protect, unpublishPage);

// ─── Public Routes (no JWT) ────────────────────────────────────────────────────

/**
 * @route   POST /pages/:id/leads
 * @desc    Capture a lead from a live/published landing page
 * @access  Public
 * @body    { name, email, message? }
 */
router.post('/:id/leads', captureLead);

// ─── Private: View Leads ───────────────────────────────────────────────────────

/**
 * @route   GET /pages/:id/leads
 * @desc    Get all captured leads for a page
 * @access  Private
 */
router.get('/:id/leads', protect, getLeads);

/**
 * @route   GET /pages/:id/export-leads
 * @desc    Download all captured leads for a page as a CSV file
 * @access  Private
 */
router.get('/:id/export-leads', protect, exportLeadsCsv);

module.exports = router;
