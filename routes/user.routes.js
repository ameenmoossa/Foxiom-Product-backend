const router = require('express').Router();
const { getAllUsers, createUser, updateUser, deleteUser } = require('../controllers/user.controller');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.use(auth, role('admin'));
router.get('/', getAllUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;