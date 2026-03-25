'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = [
      {
        name: 'John Doe',
        email: 'john.doe@yopmail.com',
        password: await bcrypt.hash('password123', 10),
        userType: 'NORMAL_USER',
        phone: '+1234567890',
        isEmailVerified: true,
        emailVerifiedAt: new Date(),
        isActive: true,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@yopmail.com',
        password: await bcrypt.hash('hotelowner123', 10),
        userType: 'HOTEL_OWNER',
        phone: '+1234567891',
        companyName: 'Grand Hotels Inc',
        isEmailVerified: true,
        emailVerifiedAt: new Date(),
        isActive: true,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    // Check for existing users and only insert if they don't exist
    for (const user of users) {
      const [existingUser] = await queryInterface.sequelize.query(
        `SELECT id FROM users WHERE email = :email LIMIT 1`,
        {
          replacements: { email: user.email },
          type: Sequelize.QueryTypes.SELECT
        }
      );

      if (!existingUser || existingUser.length === 0) {
        await queryInterface.bulkInsert('users', [user]);
        console.log(`✅ Created user: ${user.email}`);
      } else {
        console.log(`⚠️  User already exists: ${user.email}`);
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', {
      email: ['john.doe@example.com', 'jane.smith@hotel.com']
    });
  }
};
