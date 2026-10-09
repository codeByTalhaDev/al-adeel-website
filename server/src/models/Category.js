module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    'Category',
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      parentId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
      nameEn: { type: DataTypes.STRING(120), allowNull: false },
      nameAr: { type: DataTypes.STRING(120), allowNull: false },
      slug: { type: DataTypes.STRING(150), allowNull: false, unique: true },
      image: DataTypes.STRING(255),
      sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    { tableName: 'categories' }
  );

  Category.associate = (models) => {
    Category.belongsTo(Category, { foreignKey: 'parentId', as: 'parent' });
    Category.hasMany(Category, { foreignKey: 'parentId', as: 'children' });
    if (models.Product) {
      Category.hasMany(models.Product, { foreignKey: 'categoryId', as: 'products' });
    }
  };

  return Category;
};