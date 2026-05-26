const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  feedback_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  is_read: { type: Boolean, default: false },
}, { timestamps: true });

notificationSchema.index({ user_id: 1, is_read: 1 });

module.exports = mongoose.model('Notification', notificationSchema);