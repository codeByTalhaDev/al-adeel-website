const router = require('express').Router();

router.get('/health', (req, res) => {
  res.json({ success: true, status: 'ok' });
});

router.use('/categories', require('./category.routes'));
router.use('/products', require('./product.routes'));

module.exports = router;