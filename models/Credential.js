const mongoose = require('mongoose');

const credentialSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  label: { type: String, maxlength: 50 },
  environment: { type: String, enum: ['Dev', 'Staging', 'Demo'] },
  demo_url: { type: String },
  username: { type: String },
  password_encrypted: { type: String },
}, { timestamps: true });

credentialSchema.index({ product_id: 1 });

module.exports = mongoose.model('Credential', credentialSchema);