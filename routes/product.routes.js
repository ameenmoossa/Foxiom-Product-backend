const router = require('express').Router();
const { getProducts, getProduct, createProduct, updateProduct, updateStatus, reorderProducts, deleteProduct, bulkImport } = require('../controllers/product.controller');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const extensionsByMimeType = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/svg+xml': '.svg',
      'image/webp': '.webp',
    };
    const extension = extensionsByMimeType[file.mimetype] || path.extname(file.originalname);
    cb(null, `${Date.now()}${extension}`);
  },
});
const upload = multer({ storage });

router.get('/', auth, getProducts);
router.get('/:id', auth, getProduct);
// With this:
router.post('/', auth, role('admin'), upload.fields([{ name: 'icon', maxCount: 1 }, { name: 'media_images', maxCount: 5 }]), createProduct);
router.put('/:id', auth, role('admin'), upload.fields([{ name: 'icon', maxCount: 1 }, { name: 'media_images', maxCount: 5 }]), updateProduct);
router.patch('/:id/status', auth, role('admin'), updateStatus);
router.patch('/reorder', auth, role('admin'), reorderProducts);
router.delete('/:id', auth, role('admin'), deleteProduct);
router.post('/bulk-import', auth, role('admin'), bulkImport);

module.exports = router;
