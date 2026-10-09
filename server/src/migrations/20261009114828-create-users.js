module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'users',
      {
        id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
        name: { type: Sequelize.STRING(120), allowNull: false },
        email: { type: Sequelize.STRING(180), allowNull: false, unique: true },
        phone: { type: Sequelize.STRING(30), allowNull: true },
        password_hash: { type: Sequelize.STRING(255), allowNull: false },
        role: {
          type: Sequelize.ENUM('customer', 'admin'),
          allowNull: false,
          defaultValue: 'customer',
        },
        is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
        created_at: { type: Sequelize.DATE, allowNull: false },
        updated_at: { type: Sequelize.DATE, allowNull: false },
      },
      { charset: 'utf8mb4', collate: 'utf8mb4_unicode_ci' }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('users');
  },
};