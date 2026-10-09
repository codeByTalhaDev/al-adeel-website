const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const controller = require('../controllers/auth.controller');
const validate = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');
const v = require('../validators/auth.validator');

// Stops password guessing: 10 login attempts per 15 minutes from one address
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { success: false, message: 'Too many login attempts, try again later' },
});

router.post('/login', loginLimiter, validate(v.login), controller.login);
router.post('/logout', controller.logout);
router.get('/me', requireAuth, controller.me);

module.exports = router;