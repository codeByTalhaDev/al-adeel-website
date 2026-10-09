module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'products',
      {
        id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
        category_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          references: { model: 'categories', key: 'id' },
          onDelete: 'RESTRICT',
        },
        name_en: { type: Sequelize.STRING(200), allowNull: false },
        name_ar: { type: Sequelize.STRING(200), allowNull: false },
        slug: { type: Sequelize.STRING(220), allowNull: false, unique: true },
        description_en: { type: Sequelize.TEXT },
        description_ar: { type: Sequelize.TEXT },
        price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
        sale_price: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
        stock: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
        sku: { type: Sequelize.STRING(60), allowNull: true, unique: true },
        is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
        is_featured: { type: Sequelize.BOOLEAN, defaultValue: false },
        created_at: { type: Sequelize.DATE, allowNull: false },
        updated_at: { type: Sequelize.DATE, allowNull: false },
      },
      { charset: 'utf8mb4', collate: 'utf8mb4_unicode_ci' }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('products');
  },
};