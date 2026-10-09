module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'categories',
      {
        id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
        parent_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: true,
          references: { model: 'categories', key: 'id' },
          onDelete: 'SET NULL',
        },
        name_en: { type: Sequelize.STRING(120), allowNull: false },
        name_ar: { type: Sequelize.STRING(120), allowNull: false },
        slug: { type: Sequelize.STRING(150), allowNull: false, unique: true },
        image: { type: Sequelize.STRING(255) },
        sort_order: { type: Sequelize.INTEGER, defaultValue: 0 },
        is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
        created_at: { type: Sequelize.DATE, allowNull: false },
        updated_at: { type: Sequelize.DATE, allowNull: false },
      },
      { charset: 'utf8mb4', collate: 'utf8mb4_unicode_ci' }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('categories');
  },
};