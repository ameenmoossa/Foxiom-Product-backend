const mongoose = require('mongoose');

const accessLinkSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  environment: { type: String, enum: ['production', 'development'], required: true },
  platform: {
    type: String,
    enum: ['android', 'ios', 'apk', 'website', 'staging', 'testing'],
    required: true,
  },
  url: { type: String, required: true },
}, { timestamps: true });

accessLinkSchema.index({ product_id: 1, environment: 1 });

module.exports = mongoose.model('AccessLink', accessLinkSchema);
