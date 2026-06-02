'use strict';

const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const projectController = require('../controllers/projectController');
const pageController = require('../controllers/pageController');

const router = express.Router();

// ─── Project CRUD ────────────────────────────────────────────────────────────

router.use(protect); // All routes below are protected

router.post('/', projectController.createProject);
router.get('/', projectController.listProjects);
router.get('/:id', projectController.getProject);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

// ─── Branding Routes ────────────────────────────────────────────────────────

/**
 * @route   GET /projects/:id/branding
 * @desc    Get project branding configuration
 */
router.get('/:id/branding', projectController.getBranding);

/**
 * @route   PUT /projects/:id/branding
 * @desc    Update project branding configuration
 */
router.put('/:id/branding', projectController.updateBranding);

/**
 * @route   POST /projects/:id/branding/extract-from-website
 * @desc    Fetch website and extract branding colors
 */
router.post('/:id/branding/extract-from-website', projectController.extractBrandingFromWebsite);

// ─── Nested Landing Page Routes ──────────────────────────────────────────────

/**
 * @route   POST /projects/:projectId/pages
 * @desc    Create a new page inside a specific project
 */
router.post('/:projectId/pages', pageController.createPage);

/**
 * @route   GET /projects/:projectId/pages
 * @desc    List all pages belonging to a specific project
 */
router.get('/:projectId/pages', pageController.getPagesInProject);

/**
 * @route   GET /projects/:projectId/pages/:id
 * @desc    Get a specific page inside a project
 */
router.get('/:projectId/pages/:id', pageController.getPage);

/**
 * @route   PUT /projects/:projectId/pages/:id
 * @desc    Update a specific page inside a project
 */
router.put('/:projectId/pages/:id', pageController.updatePage);

/**
 * @route   DELETE /projects/:projectId/pages/:id
 * @desc    Delete a specific page inside a project
 */
router.delete('/:projectId/pages/:id', pageController.deletePage);

module.exports = router;
