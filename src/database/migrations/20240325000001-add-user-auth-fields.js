'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add authentication and status fields to users table
    await queryInterface.addColumn('users', 'password', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'isEmailVerified', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn('users', 'isDeleted', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn('users', 'isActive', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });

    await queryInterface.addColumn('users', 'emailVerifiedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    // Add indexes for performance
    await queryInterface.addIndex('users', ['isEmailVerified'], {
      name: 'idx_users_isEmailVerified',
    });

    await queryInterface.addIndex('users', ['isDeleted'], {
      name: 'idx_users_isDeleted',
    });

    await queryInterface.addIndex('users', ['isActive'], {
      name: 'idx_users_isActive',
    });

    await queryInterface.addIndex('users', ['emailVerifiedAt'], {
      name: 'idx_users_emailVerifiedAt',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove indexes first
    await queryInterface.removeIndex('users', 'idx_users_isEmailVerified');
    await queryInterface.removeIndex('users', 'idx_users_isDeleted');
    await queryInterface.removeIndex('users', 'idx_users_isActive');
    await queryInterface.removeIndex('users', 'idx_users_emailVerifiedAt');

    // Remove columns in reverse order
    await queryInterface.removeColumn('users', 'deletedAt');
    await queryInterface.removeColumn('users', 'emailVerifiedAt');
    await queryInterface.removeColumn('users', 'isActive');
    await queryInterface.removeColumn('users', 'isDeleted');
    await queryInterface.removeColumn('users', 'isEmailVerified');
    await queryInterface.removeColumn('users', 'password');
  },
};
