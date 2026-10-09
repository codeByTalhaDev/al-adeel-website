const { z } = require('zod');

const idParams = z.object({ id: z.coerce.number().int().positive() });

const productFields = z.object({
  categoryId: z.number().int().positive(),
  nameEn: z.string().trim().min(2).max(200),
  nameAr: z.string().trim().min(2).max(200),
  descriptionEn: z.string().trim().max(5000).nullable().optional(),
  descriptionAr: z.string().trim().max(5000).nullable().optional(),
  price: z.number().positive().max(9999999),
  salePrice: z.number().positive().nullable().optional(),
  stock: z.number().int().min(0).optional(),
  sku: z.string().trim().min(1).max(60).nullable().optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

const salePriceIsLower = (data) =>
  data.salePrice == null || data.price == null || data.salePrice < data.price;

const salePriceRule = {
  message: 'Sale price must be lower than the price',
  path: ['salePrice'],
};

const booleanFromText = z.enum(['true', 'false']).transform((value) => value === 'true');

exports.create = z.object({
  body: productFields.refine(salePriceIsLower, salePriceRule),
  params: z.any().optional(),
  query: z.any().optional(),
});

exports.update = z.object({
  body: productFields.partial().refine(salePriceIsLower, salePriceRule),
  params: idParams,
  query: z.any().optional(),
});

exports.byId = z.object({
  params: idParams,
  body: z.any().optional(),
  query: z.any().optional(),
});

exports.list = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(12),
    category: z.string().trim().optional(),
    search: z.string().trim().max(100).optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    featured: booleanFromText.optional(),
    sort: z.enum(['newest', 'price_asc', 'price_desc', 'name_asc']).default('newest'),
  }),
  params: z.any().optional(),
  body: z.any().optional(),
});