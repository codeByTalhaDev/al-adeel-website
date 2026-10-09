const service = require('../services/category.service');
const asyncHandler = require('../utils/asyncHandler');
const { ok, created } = require('../utils/response');

exports.list = asyncHandler(async (req, res) => {
  ok(res, await service.list());
});

exports.getBySlug = asyncHandler(async (req, res) => {
  ok(res, await service.getBySlug(req.params.slug));
});

exports.create = asyncHandler(async (req, res) => {
  created(res, await service.create(req.validated.body), 'Category created');
});

exports.update = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  ok(res, await service.update(id, req.validated.body), 'Category updated');
});

exports.remove = asyncHandler(async (req, res) => {
  await service.remove(req.validated.params.id);
  ok(res, null, 'Category deleted');
});