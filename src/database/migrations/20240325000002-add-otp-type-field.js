'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add the type column to the existing table
    await queryInterface.addColumn('otps', 'type', {
      type: Sequelize.ENUM('EMAIL_VERIFICATION', 'PASSWORD_RESET'),
      allowNull: false,
      defaultValue: 'EMAIL_VERIFICATION',
    });

    // Add index for the new type column
    await queryInterface.addIndex('otps', ['type'], {
      name: 'idx_otps_type',
    });

    // Add composite index for email and type
    await queryInterface.addIndex('otps', ['email', 'type'], {
      name: 'idx_otps_email_type',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove indexes first
    await queryInterface.removeIndex('otps', 'idx_otps_type');
    await queryInterface.removeIndex('otps', 'idx_otps_email_type');

    // Remove the type column
    await queryInterface.removeColumn('otps', 'type');
  },
};
