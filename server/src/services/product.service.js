const { Op } = require('sequelize');
const { Product, Category } = require('../models');
const ApiError = require('../utils/ApiError');
const slugify = require('../utils/slugify');

const SORT_OPTIONS = {
  newest: [['createdAt', 'DESC']],
  price_asc: [['price', 'ASC']],
  price_desc: [['price', 'DESC']],
  name_asc: [['nameEn', 'ASC']],
};

const categoryInclude = {
  model: Category,
  as: 'category',
  attributes: ['id', 'nameEn', 'nameAr', 'slug'],
};

const makeUniqueSlug = async (nameEn, ignoreId) => {
  const base = slugify(nameEn);
  let slug = base;
  let count = 1;

  while (true) {
    const found = await Product.findOne({ where: { slug } });
    if (!found || found.id === ignoreId) return slug;
    count += 1;
    slug = `${base}-${count}`;
  }
};

const assertCategoryExists = async (categoryId) => {
  const category = await Category.findByPk(categoryId);
  if (!category) throw ApiError.badRequest('Category does not exist');
};

const assertSalePriceIsLower = (price, salePrice) => {
  if (salePrice != null && salePrice >= price) {
    throw ApiError.badRequest('Sale price must be lower than the price');
  }
};

exports.list = async (filters) => {
  const { page, limit, category, search, minPrice, maxPrice, featured, sort } = filters;
  const where = { isActive: true };

  if (category) {
    const found = await Category.findOne({ where: { slug: category, isActive: true } });
    if (!found) {
      return { items: [], pagination: { page, limit, total: 0, totalPages: 0 } };
    }
    where.categoryId = found.id;
  }

  if (search) {
    where[Op.or] = [
      { nameEn: { [Op.like]: `%${search}%` } },
      { nameAr: { [Op.like]: `%${search}%` } },
    ];
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price[Op.gte] = minPrice;
    if (maxPrice !== undefined) where.price[Op.lte] = maxPrice;
  }

  if (featured !== undefined) where.isFeatured = featured;

  const { rows, count } = await Product.findAndCountAll({
    where,
    include: [categoryInclude],
    order: SORT_OPTIONS[sort],
    limit,
    offset: (page - 1) * limit,
  });

  return {
    items: rows,
    pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) },
  };
};

exports.getBySlug = async (slug) => {
  const product = await Product.findOne({
    where: { slug, isActive: true },
    include: [categoryInclude],
  });
  if (!product) throw ApiError.notFound('Product not found');
  return product;
};

exports.create = async (data) => {
  await assertCategoryExists(data.categoryId);
  assertSalePriceIsLower(data.price, data.salePrice);

  const slug = await makeUniqueSlug(data.nameEn);
  return Product.create({ ...data, slug });
};

exports.update = async (id, data) => {
  const product = await Product.findByPk(id);
  if (!product) throw ApiError.notFound('Product not found');

  if (data.categoryId) await assertCategoryExists(data.categoryId);

  const price = data.price !== undefined ? data.price : product.price;
  const salePrice = data.salePrice !== undefined ? data.salePrice : product.salePrice;
  assertSalePriceIsLower(price, salePrice);

  if (data.nameEn) data.slug = await makeUniqueSlug(data.nameEn, id);

  return product.update(data);
};

exports.remove = async (id) => {
  const product = await Product.findByPk(id);
  if (!product) throw ApiError.notFound('Product not found');
  await product.destroy();
};