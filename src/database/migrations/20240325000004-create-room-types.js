'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('room_types', {
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
      basePrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      maxOccupancy: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      adults: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      children: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      numberOfBeds: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      bedType: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      roomSize: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      hasAirConditioning: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      hasHeating: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      hasPrivateBathroom: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      hasKitchen: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      hasBalcony: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      amenities: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      isActive: {
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
    await queryInterface.addIndex('room_types', ['hotelId'], {
      name: 'idx_room_types_hotelId',
    });

    await queryInterface.addIndex('room_types', ['isActive'], {
      name: 'idx_room_types_isActive',
    });

    await queryInterface.addIndex('room_types', ['basePrice'], {
      name: 'idx_room_types_basePrice',
    });

    await queryInterface.addIndex('room_types', ['maxOccupancy'], {
      name: 'idx_room_types_maxOccupancy',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove indexes first
    await queryInterface.removeIndex('room_types', 'idx_room_types_hotelId');
    await queryInterface.removeIndex('room_types', 'idx_room_types_isActive');
    await queryInterface.removeIndex('room_types', 'idx_room_types_basePrice');
    await queryInterface.removeIndex('room_types', 'idx_room_types_maxOccupancy');

    // Drop table
    await queryInterface.dropTable('room_types');
  },
};
