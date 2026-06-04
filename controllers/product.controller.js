const Product = require('../models/Product');
const AccessLink = require('../models/AccessLink');
const { groupLinks } = require('./accessLink.controller');

const attachAccessLinks = async (product) => {
  if (!product) return product;

  const plainProduct = product.toObject ? product.toObject() : product;
  const links = await AccessLink.find({ product_id: plainProduct._id }).sort('environment platform');

  return {
    ...plainProduct,
    ...groupLinks(links),
  };
};

exports.getProducts = async (req, res) => {
  try {
const isAdmin = req.query.includeArchived === 'true';
const filter = isAdmin ? {} : { status: { $ne: 'Archived' } };
const products = await Product.find(filter).sort('sort_order');

    const links = await AccessLink.find({
      product_id: { $in: products.map(product => product._id) },
    }).sort('environment platform');

    const linksByProductId = links.reduce((map, link) => {
      const productId = String(link.product_id);
      if (!map[productId]) map[productId] = [];
      map[productId].push(link);
      return map;
    }, {});

    const productsWithLinks = products.map(product => {
      const plainProduct = product.toObject();
      return {
        ...plainProduct,
        ...groupLinks(linksByProductId[String(product._id)] || []),
      };
    });

    res.json(productsWithLinks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json(await attachAccessLinks(product));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.createProduct = async (req, res) => {
  try {
    const data = { ...req.body };
if (data.icon_base64) {
  data.icon_url = data.icon_base64;
  delete data.icon_base64;
}    
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
if (data.icon_base64) {
  data.icon_url = data.icon_base64;
  delete data.icon_base64;
}
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
