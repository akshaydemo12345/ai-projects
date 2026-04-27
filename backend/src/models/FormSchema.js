const mongoose = require("mongoose");

const FormFieldSchema = new mongoose.Schema({
  field_name: { type: String, required: true },
  name: String, // Semantic name (e.g., 'full_name' instead of 'field_0')
  label: String,
  type: String,
  required: { type: Boolean, default: false },
  placeholder: String,
  options: [String],
  validation: { type: Object, default: {} }
});

const FormSchema = new mongoose.Schema({
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true
  },
  page_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Page",
    required: true
  },
  fields: [FormFieldSchema]
}, { timestamps: true });

// Ensure one schema per page
FormSchema.index({ project_id: 1, page_id: 1 }, { unique: true });

module.exports = mongoose.model("FormSchema", FormSchema);
