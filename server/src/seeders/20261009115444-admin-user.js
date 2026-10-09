require('dotenv').config();
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface) {
    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error('Set ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD in .env first');
    }
    if (ADMIN_PASSWORD.length < 8) {
      throw new Error('ADMIN_PASSWORD must be at least 8 characters');
    }

    const email = ADMIN_EMAIL.trim().toLowerCase();

    // Do nothing if this admin already exists
    const existingId = await queryInterface.rawSelect('users', { where: { email } }, ['id']);
    if (existingId) {
      console.log(`Admin ${email} already exists, skipping`);
      return;
    }

    const now = new Date();
    await queryInterface.bulkInsert('users', [
      {
        name: ADMIN_NAME,
        email,
        password_hash: await bcrypt.hash(ADMIN_PASSWORD, 12),
        role: 'admin',
        is_active: true,
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { email: process.env.ADMIN_EMAIL.trim().toLowerCase() });
  },
};