const router = require('express').Router();
const { getProducts, getProduct, createProduct, updateProduct, updateStatus, reorderProducts, deleteProduct, bulkImport } = require('../controllers/product.controller');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.get('/', auth, getProducts);
router.get('/:id', auth, getProduct);
router.post('/', auth, role('admin'), upload.single('icon'), createProduct);
router.put('/:id', auth, role('admin'), upload.single('icon'), updateProduct);
router.patch('/:id/status', auth, role('admin'), updateStatus);
router.patch('/reorder', auth, role('admin'), reorderProducts);
router.delete('/:id', auth, role('admin'), deleteProduct);
router.post('/bulk-import', auth, role('admin'), bulkImport);

module.exports = router;