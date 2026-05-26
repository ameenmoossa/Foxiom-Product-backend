const router = require('express').Router({ mergeParams: true });
const { getCredentials, addCredential, updateCredential, deleteCredential } = require('../controllers/credential.controller');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.get('/', auth, getCredentials);
router.post('/', auth, role('admin'), addCredential);
router.put('/:credId', auth, role('admin'), updateCredential);
router.delete('/:credId', auth, role('admin'), deleteCredential);

module.exports = router;