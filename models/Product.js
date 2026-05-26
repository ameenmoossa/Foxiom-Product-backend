const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tagline: { type: String, maxlength: 80 },
  description: { type: String },
  category: { type: String, enum: ['SaaS', 'Internal Tool', 'API', 'Mobile App', 'Other'] },
  icon_url: { type: String },
  status: { type: String, enum: ['Active', 'Draft', 'Beta', 'Archived'], default: 'Draft' },
  tech_stack: [String],
  features: [String],
  use_cases: [{ title: String, description: String }],
  media: [String],
  demo_video_url: { type: String },
  sort_order: { type: Number, default: 0 },
}, { timestamps: true });

productSchema.index({ status: 1, sort_order: 1 });

module.exports = mongoose.model('Product', productSchema);