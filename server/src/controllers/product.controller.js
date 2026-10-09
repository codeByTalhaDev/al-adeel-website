const service = require('../services/product.service');
const asyncHandler = require('../utils/asyncHandler');
const { ok, created } = require('../utils/response');

exports.list = asyncHandler(async (req, res) => {
  ok(res, await service.list(req.validated.query));
});

exports.getBySlug = asyncHandler(async (req, res) => {
  ok(res, await service.getBySlug(req.params.slug));
});

exports.create = asyncHandler(async (req, res) => {
  created(res, await service.create(req.validated.body), 'Product created');
});

exports.update = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  ok(res, await service.update(id, req.validated.body), 'Product updated');
});

exports.remove = asyncHandler(async (req, res) => {
  await service.remove(req.validated.params.id);
  ok(res, null, 'Product deleted');
});