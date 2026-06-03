const mongoose = require('mongoose');

const credentialSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  environment: {
    // Requested: Dev/Staging/Demo/Production
    type: String,
    enum: ['development', 'staging', 'demo', 'production', 'Dev', 'Staging', 'Demo', 'Production'],
    required: true,
  },
  url: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true }, // AES-256 encrypted at rest

  // Keep existing field for backward compatibility.
  platform: {
    type: String,
    enum: ['android', 'ios', 'apk', 'website', 'staging', 'testing'],
    required: false,
  },
}, { timestamps: true, toJSON: { transform: (doc, ret) => ret } });

credentialSchema.index({ product_id: 1 });

module.exports = mongoose.model('Credential', credentialSchema);
