'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Drop any existing constraints and table
    await queryInterface.dropTable('otps').catch(() => {
      // Ignore error if table doesn't exist
    });

    // Create the OTP table with proper structure
    await queryInterface.createTable('otps', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      otp: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      attempts: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Add indexes for performance
    await queryInterface.addIndex('otps', ['email'], {
      name: 'idx_otps_email',
    });

    await queryInterface.addIndex('otps', ['expiresAt'], {
      name: 'idx_otps_expiresAt',
    });

    await queryInterface.addIndex('otps', ['email', 'isVerified'], {
      name: 'idx_otps_email_verified',
    });

    // Add foreign key constraint after table creation
    await queryInterface.addConstraint('otps', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'fk_otps_userId',
      references: {
        table: 'users',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('otps');
  },
};
