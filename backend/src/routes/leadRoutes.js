const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const { protect } = require('../middleware/authMiddleware');

// ─── Explicit CORS Preflight (for WordPress / cross-domain form submissions) ──
router.options('/', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  return res.sendStatus(204);
});

// ─── Public: serve secure tracking JS to proxied landing pages ─────────────
router.get('/tracker.js', leadController.getTrackerJs);

// ─── Public: form submission from any landing page ───────────────────────────
router.post('/', leadController.createLead);

// ─── Private: view/delete leads in dashboard ────────────────────────────────────────
router.get('/', protect, leadController.getLeads);
router.delete('/:id', protect, leadController.deleteLead);

module.exports = router;
