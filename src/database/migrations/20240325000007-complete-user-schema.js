'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add missing columns to users table based on current model
    // Note: password, isEmailVerified, isDeleted, isActive, emailVerifiedAt, deletedAt 
    // are already added by 20240325000001-add-user-auth-fields.js migration

    await queryInterface.addColumn('users', 'userType', {
      type: Sequelize.ENUM('NORMAL_USER', 'HOTEL_OWNER', 'ADMIN'),
      allowNull: false,
      defaultValue: 'NORMAL_USER',
    });

    await queryInterface.addColumn('users', 'phone', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'companyName', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Add index for userType (other indexes already exist)
    await queryInterface.addIndex('users', ['userType'], {
      name: 'idx_users_userType',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove index first
    await queryInterface.removeIndex('users', 'idx_users_userType');

    // Remove columns in reverse order
    await queryInterface.removeColumn('users', 'companyName');
    await queryInterface.removeColumn('users', 'phone');
    await queryInterface.removeColumn('users', 'userType');
  },
};
