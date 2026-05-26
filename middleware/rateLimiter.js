const rateLimit = require('express-rate-limit');

module.exports = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Too many attempts. Try again after 15 minutes.' },
  legacyHeaders: false,
  standardHeaders: 'draft-7',
});