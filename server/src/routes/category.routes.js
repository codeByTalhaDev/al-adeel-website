const router = require('express').Router();
const controller = require('../controllers/category.controller');
const validate = require('../middleware/validate');
const v = require('../validators/category.validator');

// Public
router.get('/', controller.list);
router.get('/:slug', controller.getBySlug);

// Admin only (login protection gets added in a later step)
router.post('/', validate(v.create), controller.create);
router.put('/:id', validate(v.update), controller.update);
router.delete('/:id', validate(v.byId), controller.remove);

module.exports = router;