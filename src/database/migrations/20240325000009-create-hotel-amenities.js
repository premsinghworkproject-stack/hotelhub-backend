'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('hotel_amenities', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      icon: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      isAvailable: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      hotelId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'hotels',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Add indexes for performance
    await queryInterface.addIndex('hotel_amenities', ['hotelId'], {
      name: 'idx_hotel_amenities_hotelId',
    });

    await queryInterface.addIndex('hotel_amenities', ['name'], {
      name: 'idx_hotel_amenities_name',
    });

    await queryInterface.addIndex('hotel_amenities', ['isAvailable'], {
      name: 'idx_hotel_amenities_isAvailable',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove indexes first
    await queryInterface.removeIndex('hotel_amenities', 'idx_hotel_amenities_hotelId');
    await queryInterface.removeIndex('hotel_amenities', 'idx_hotel_amenities_name');
    await queryInterface.removeIndex('hotel_amenities', 'idx_hotel_amenities_isAvailable');

    // Drop table
    await queryInterface.dropTable('hotel_amenities');
  },
};
