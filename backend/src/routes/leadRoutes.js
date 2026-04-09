const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const { protect } = require('../middleware/authMiddleware');

// Public route for form submission
router.post('/', leadController.createLead);

// Private route for viewing leads
router.get('/', protect, leadController.getLeads);

module.exports = router;
