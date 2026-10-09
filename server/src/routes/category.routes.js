const router = require('express').Router();
const controller = require('../controllers/category.controller');
const validate = require('../middleware/validate');
const { requireAdmin } = require('../middleware/auth');
const v = require('../validators/category.validator');

// Public
router.get('/', controller.list);
router.get('/:slug', controller.getBySlug);

// Admin only
router.post('/', requireAdmin, validate(v.create), controller.create);
router.put('/:id', requireAdmin, validate(v.update), controller.update);
router.delete('/:id', requireAdmin, validate(v.byId), controller.remove);

module.exports = router;