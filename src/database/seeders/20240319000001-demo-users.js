'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if users already exist
    const existingUsers = await queryInterface.select(null, 'users', {
      where: {
        email: {
          [Sequelize.Op.in]: ['john.doe@example.com', 'jane.smith@example.com', 'bob.johnson@example.com'],
        },
      },
    });

    const existingEmails = existingUsers.map(user => user.email);
    const usersToInsert = [
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Bob Johnson',
        email: 'bob.johnson@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ].filter(user => !existingEmails.includes(user.email));

    if (usersToInsert.length > 0) {
      await queryInterface.bulkInsert('users', usersToInsert);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', {
      email: {
        [Sequelize.Op.in]: ['john.doe@example.com', 'jane.smith@example.com', 'bob.johnson@example.com'],
      },
    });
  },
};
