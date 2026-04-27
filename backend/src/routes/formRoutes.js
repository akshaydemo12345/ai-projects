const express = require("express");
const router = express.Router();
const FormSchema = require("../models/FormSchema");
const { protect } = require("../middleware/authMiddleware");

// GET schema for a project
router.get("/project/:project_id", async (req, res) => {
  try {
    const schema = await FormSchema.findOne({
      project_id: req.params.project_id
    });
    
    if (!schema) {
      return res.status(404).json({
        success: false,
        message: "No form schema found for this project"
      });
    }

    res.json({
      success: true,
      data: schema
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET schema for a page (by slug)
router.get("/page/:slug", async (req, res) => {
  try {
    const Page = require("../models/Page");
    const page = await Page.findOne({ slug: req.params.slug });
    
    if (!page) {
      return res.status(404).json({ success: false, message: "Page not found" });
    }

    const schema = await FormSchema.findOne({
      project_id: page.projectId
    });

    if (!schema) {
      return res.status(404).json({ success: false, message: "No form schema found" });
    }

    res.json({
      success: true,
      data: schema
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
