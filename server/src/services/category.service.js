const { Category } = require('../models');
const ApiError = require('../utils/ApiError');
const slugify = require('../utils/slugify');

// Makes a slug that no other category is using, e.g. "sofa-sets", "sofa-sets-2"
const makeUniqueSlug = async (nameEn, ignoreId) => {
  const base = slugify(nameEn);
  let slug = base;
  let count = 1;

  while (true) {
    const found = await Category.findOne({ where: { slug } });
    if (!found || found.id === ignoreId) return slug;
    count += 1;
    slug = `${base}-${count}`;
  }
};

exports.list = ({ onlyActive = true } = {}) =>
  Category.findAll({
    where: onlyActive ? { isActive: true } : {},
    order: [['sortOrder', 'ASC'], ['id', 'ASC']],
  });

exports.getBySlug = async (slug) => {
  const category = await Category.findOne({ where: { slug, isActive: true } });
  if (!category) throw ApiError.notFound('Category not found');
  return category;
};

exports.create = async (data) => {
  const slug = await makeUniqueSlug(data.nameEn);
  return Category.create({ ...data, slug });
};

exports.update = async (id, data) => {
  const category = await Category.findByPk(id);
  if (!category) throw ApiError.notFound('Category not found');
  if (data.nameEn) data.slug = await makeUniqueSlug(data.nameEn, id);
  return category.update(data);
};

exports.remove = async (id) => {
  const category = await Category.findByPk(id);
  if (!category) throw ApiError.notFound('Category not found');
  await category.destroy();
};