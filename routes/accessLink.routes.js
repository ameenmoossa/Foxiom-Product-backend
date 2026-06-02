const router = require('express').Router({ mergeParams: true });
const { getAccessLinks, addAccessLink, updateAccessLink, deleteAccessLink } = require('../controllers/accessLink.controller');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.get('/', auth, getAccessLinks);
router.post('/', auth, role('admin'), addAccessLink);
router.put('/:linkId', auth, role('admin'), updateAccessLink);
router.delete('/:linkId', auth, role('admin'), deleteAccessLink);

module.exports = router;
