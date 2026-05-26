const router = require('express').Router();
const { login, forgotPassword, resetPassword } = require('../controllers/auth.controller');
const limiter = require('../middleware/rateLimiter');

router.post('/login', limiter, login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;