const Credential = require('../models/Credential');
const { encrypt, decrypt } = require('../utils/cryptoAes256');

const normalizeEnvironment = (env) => {
  const v = String(env || '').trim().toLowerCase();
  if (!v) return v;
  // Support both requested labels and existing schema values.
  if (v === 'dev') return 'development';
  if (v === 'staging' || v === 'demo' || v === 'production' || v === 'production') return v; // no-op; will validate later
  if (v === 'demo') return 'development';
  if (v === 'production') return 'production';
  // If already matches schema enum.
  return v;
};

exports.getCredentials = async (req, res) => {
  try {
    const credentials = await Credential.find({
      product_id: req.params.id,
    }).sort('environment platform');

    const decrypted = credentials.map((c) => {
      const plain = c.toObject ? c.toObject() : c;
      if (plain.password) plain.password = decrypt(plain.password);
      return plain;
    });

    res.json(decrypted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createCredential = async (req, res) => {
  try {
    const data = { ...req.body, product_id: req.params.id };

    // Expecting: product_id, environment, url, username, password
    if (data.password) {
      data.password = encrypt(data.password);
    }

    // If username/password fields are not present in schema yet, Mongoose will ignore unless strict=false.
    // But we will extend schema in models/Credential.js as part of this task.

    const credential = await Credential.create(data);
    res.status(201).json(credential);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateCredential = async (req, res) => {
  try {
    const data = { ...req.body };

    if (data.password) {
      data.password = encrypt(data.password);
    }

    const cred = await Credential.findByIdAndUpdate(req.params.credId, data, {
      new: true,
      runValidators: true,
    });

    if (!cred) return res.status(404).json({ message: 'Credential not found' });

    if (cred.password) cred.password = decrypt(cred.password);
    res.json(cred);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteCredential = async (req, res) => {
  try {
    const cred = await Credential.findByIdAndDelete(req.params.credId);
    if (!cred) return res.status(404).json({ message: 'Credential not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

