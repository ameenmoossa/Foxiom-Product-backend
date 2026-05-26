const router = require('express').Router();
const { getNotifications, markAsRead } = require('../controllers/notification.controller');
const auth = require('../middleware/auth');

router.get('/', auth, getNotifications);
router.patch('/mark-read', auth, markAsRead);

module.exports = router;