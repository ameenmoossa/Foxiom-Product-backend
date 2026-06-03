const router = require('express').Router({ mergeParams: true });
const auth = require('../middleware/auth');
const role = require('../middleware/role');

const {
  getCredentials,
  createCredential,
  updateCredential,
  deleteCredential,
} = require('../controllers/credential.controller');

// GET /api/products/:id/credentials — authenticated users only (admin + staff)
router.get(
  '/',
  auth,
  role('admin', 'staff'),
  getCredentials
);

// POST /api/products/:id/credentials — admin only
router.post(
  '/',
  auth,
  role('admin'),
  createCredential
);

// PUT /api/credentials/:credId — admin only
router.put(
  '/:credId',
  auth,
  role('admin'),
  updateCredential
);

// DELETE /api/credentials/:credId — admin only
router.delete(
  '/:credId',
  auth,
  role('admin'),
  deleteCredential
);

module.exports = router;

