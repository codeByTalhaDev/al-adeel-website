module.exports = (sequelize, DataTypes) => {
  const toNumber = (value) => (value === null || value === undefined ? null : Number(value));

  const Product = sequelize.define(
    'Product',
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      categoryId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      nameEn: { type: DataTypes.STRING(200), allowNull: false },
      nameAr: { type: DataTypes.STRING(200), allowNull: false },
      slug: { type: DataTypes.STRING(220), allowNull: false, unique: true },
      descriptionEn: DataTypes.TEXT,
      descriptionAr: DataTypes.TEXT,
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        get() {
          return toNumber(this.getDataValue('price'));
        },
      },
      salePrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        get() {
          return toNumber(this.getDataValue('salePrice'));
        },
      },
      stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      sku: { type: DataTypes.STRING(60), allowNull: true, unique: true },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
      isFeatured: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    { tableName: 'products' }
  );

  Product.associate = (models) => {
    Product.belongsTo(models.Category, { foreignKey: 'categoryId', as: 'category' });
  };

  return Product;
};