const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const leadController = require('../controllers/leadController');

// Export handlers directly for backwards-compatibility/module export consistency
exports.createLead = leadController.createLead;
exports.getLeads = leadController.getLeads;
exports.exportLeads = leadController.exportLeads;
exports.deleteLead = leadController.deleteLead;
exports.getLeadFilters = leadController.getLeadFilters;
exports.getTrackerJs = leadController.getTrackerJs;

// ─── Route Definitions ────────────────────────────────────────────────────────

// Public: Create Lead (from landing pages)
router.post('/', leadController.createLead);

// Public: Tracker.js serving
router.get('/tracker.js', leadController.getTrackerJs);

// Protected: All other lead management routes
router.use(protect);

router.get('/', leadController.getLeads);
router.get('/filters', leadController.getLeadFilters);
router.get('/get-filters', leadController.getLeadFilters); // Alias for frontend compatibility
router.get('/export', leadController.exportLeads);
router.delete('/:id', leadController.deleteLead);

module.exports = router;
