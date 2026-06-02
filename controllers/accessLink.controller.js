const AccessLink = require('../models/AccessLink');
const AuditLog = require('../models/AuditLog');

const platformByEnvironment = {
  production: ['android', 'ios', 'apk'],
  development: ['website', 'staging', 'testing'],
};

const normalizeAccessLink = (body, productId) => {
  const environment = String(body.environment || '').toLowerCase();
  const platform = String(body.platform || '').toLowerCase();
  const url = String(body.url || '').trim();

  if (!environment) {
    throw new Error('Environment is required.');
  }

  if (!platform) {
    throw new Error('Platform is required.');
  }

  if (!url) {
    throw new Error('URL is required.');
  }

  if (!platformByEnvironment[environment]) {
    throw new Error('Environment must be production or development.');
  }

  if (!platformByEnvironment[environment].includes(platform)) {
    throw new Error('Choose a valid platform for this environment.');
  }

  return { product_id: productId, environment, platform, url };
};

const groupLinks = (links) => ({
  productionLinks: links.filter(link => link.environment === 'production'),
  developmentLinks: links.filter(link => link.environment === 'development'),
});

exports.getAccessLinks = async (req, res) => {
  try {
    const links = await AccessLink.find({ product_id: req.params.id }).sort('environment platform');
    await AuditLog.create({ user_id: req.user.id, product_id: req.params.id, action: 'viewed_access_links' });
    res.json(links);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addAccessLink = async (req, res) => {
  try {
    console.log('Incoming access link:', req.body);
    const data = normalizeAccessLink(req.body, req.params.id);
    const link = await AccessLink.create(data);
    res.status(201).json(link);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateAccessLink = async (req, res) => {
  try {
    console.log('Incoming access link:', req.body);
    const data = normalizeAccessLink(req.body, req.params.id);
    delete data.product_id;
    const linkId = req.params.linkId || req.params.credId;
    const link = await AccessLink.findOneAndUpdate(
      { _id: linkId, product_id: req.params.id },
      data,
      { new: true, runValidators: true }
    );
    if (!link) return res.status(404).json({ message: 'Access link not found.' });
    res.json(link);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteAccessLink = async (req, res) => {
  try {
    const linkId = req.params.linkId || req.params.credId;
    const link = await AccessLink.findOneAndDelete({ _id: linkId, product_id: req.params.id });
    if (!link) return res.status(404).json({ message: 'Access link not found.' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.groupLinks = groupLinks;
