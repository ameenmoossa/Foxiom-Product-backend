const Credential = require('../models/Credential');
const AuditLog = require('../models/AuditLog');
const { encrypt, decrypt } = require('../utils/encrypt');

exports.getCredentials = async (req, res) => {
  try {
    const creds = await Credential.find({ product_id: req.params.id });
    const decrypted = creds.map(c => ({
      ...c._doc,
      password_encrypted: decrypt(c.password_encrypted),
    }));
    await AuditLog.create({ user_id: req.user.id, product_id: req.params.id, action: 'viewed_credentials' });
    res.json(decrypted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addCredential = async (req, res) => {
  try {
    const data = { ...req.body, product_id: req.params.id };
    data.password_encrypted = encrypt(req.body.password);
    delete data.password;
    const cred = await Credential.create(data);
    res.status(201).json(cred);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCredential = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.password) {
      data.password_encrypted = encrypt(data.password);
      delete data.password;
    }
    const cred = await Credential.findByIdAndUpdate(req.params.credId, data, { new: true });
    res.json(cred);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteCredential = async (req, res) => {
  try {
    await Credential.findByIdAndDelete(req.params.credId);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};