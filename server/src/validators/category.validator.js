const { z } = require('zod');

const idParams = z.object({ id: z.coerce.number().int().positive() });

exports.create = z.object({
  body: z.object({
    nameEn: z.string().trim().min(2).max(120),
    nameAr: z.string().trim().min(2).max(120),
    parentId: z.number().int().positive().nullable().optional(),
    sortOrder: z.number().int().optional(),
    isActive: z.boolean().optional(),
  }),
  params: z.any().optional(),
  query: z.any().optional(),
});

exports.update = z.object({
  body: exports.create.shape.body.partial(),
  params: idParams,
  query: z.any().optional(),
});

exports.byId = z.object({
  params: idParams,
  body: z.any().optional(),
  query: z.any().optional(),
});