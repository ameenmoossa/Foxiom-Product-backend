const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  submitted_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  feedback_type: { type: String, enum: ['Bug Report', 'Feature Suggestion', 'UI Issue', 'Market Observation', 'General Note'] },
  title: { type: String, maxlength: 150 },
  description: { type: String },
  priority: { type: String, enum: ['Low', 'Medium', 'High'] },
  status: { type: String, enum: ['Open', 'Under Review', 'Implemented', 'Rejected'], default: 'Open' },
  upvote_count: { type: Number, default: 0 },
  upvoted_by: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  admin_reply: { type: String },
}, { timestamps: true });

feedbackSchema.index({ product_id: 1, status: 1 });

module.exports = mongoose.model('Feedback', feedbackSchema);