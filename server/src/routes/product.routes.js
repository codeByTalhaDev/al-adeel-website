const router = require('express').Router();
const controller = require('../controllers/product.controller');
const validate = require('../middleware/validate');
const v = require('../validators/product.validator');

// Public
router.get('/', validate(v.list), controller.list);
router.get('/:slug', controller.getBySlug);

// Admin only (login protection gets added in a later step)
router.post('/', validate(v.create), controller.create);
router.put('/:id', validate(v.update), controller.update);
router.delete('/:id', validate(v.byId), controller.remove);

module.exports = router;