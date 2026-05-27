const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  const products = await Product.find({ status: { $ne: 'Archived' } }).sort('sort_order');
  res.json(products);
};

exports.getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json(product);
};
exports.createProduct = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.files?.icon) data.icon_url = `/uploads/${req.files.icon[0].filename}`;  // ← changed
    
    if (data.use_cases && typeof data.use_cases === 'string') {
      data.use_cases = JSON.parse(data.use_cases);
    }
    if (req.files?.media_images) {
      data.media = req.files.media_images.map(f => `/uploads/${f.filename}`);
    }

    const product = await Product.create(data);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.files?.icon) data.icon_url = `/uploads/${req.files.icon[0].filename}`;  // ← changed

    if (data.use_cases && typeof data.use_cases === 'string') {
      data.use_cases = JSON.parse(data.use_cases);
    }
    if (req.files?.media_images) {
      data.media = req.files.media_images.map(f => `/uploads/${f.filename}`);
    }

    const product = await Product.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
exports.updateStatus = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.reorderProducts = async (req, res) => {
  // req.body = [{ id, sort_order }]
  try {
    await Promise.all(req.body.map(({ id, sort_order }) =>
      Product.findByIdAndUpdate(id, { sort_order })
    ));
    res.json({ message: 'Reordered' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.bulkImport = async (req, res) => {
  try {
    // req.body = array of products
    const products = await Product.insertMany(req.body);
    res.status(201).json({ imported: products.length, products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};