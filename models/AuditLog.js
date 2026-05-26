const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  action: { type: String },
  timestamp: { type: Date, default: Date.now },
});

auditLogSchema.index({ product_id: 1, user_id: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);