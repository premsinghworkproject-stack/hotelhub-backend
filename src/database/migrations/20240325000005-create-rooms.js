'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('rooms', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      roomNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      floor: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'OUT_OF_ORDER', 'CLEANING'),
        allowNull: false,
        defaultValue: 'AVAILABLE',
      },
      customPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      isSmokingAllowed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isPetFriendly: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      hasMinibar: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      hasSafe: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      hasBalcony: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      hasBathtub: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      hasShower: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      hasKitchenette: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      hasWorkDesk: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      hasTV: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      hasWiFi: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
      roomTypeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'room_types',
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
    await queryInterface.addIndex('rooms', ['roomNumber'], {
      name: 'idx_rooms_roomNumber',
    });

    await queryInterface.addIndex('rooms', ['hotelId'], {
      name: 'idx_rooms_hotelId',
    });

    await queryInterface.addIndex('rooms', ['roomTypeId'], {
      name: 'idx_rooms_roomTypeId',
    });

    await queryInterface.addIndex('rooms', ['status'], {
      name: 'idx_rooms_status',
    });

    await queryInterface.addIndex('rooms', ['isSmokingAllowed'], {
      name: 'idx_rooms_isSmokingAllowed',
    });

    await queryInterface.addIndex('rooms', ['isPetFriendly'], {
      name: 'idx_rooms_isPetFriendly',
    });

    await queryInterface.addIndex('rooms', ['hasWiFi'], {
      name: 'idx_rooms_hasWiFi',
    });

    await queryInterface.addIndex('rooms', ['hasAirConditioning'], {
      name: 'idx_rooms_hasAirConditioning',
    });

    // Composite indexes for common search combinations
    await queryInterface.addIndex('rooms', ['roomTypeId', 'status'], {
      name: 'idx_rooms_roomTypeId_status',
    });

    await queryInterface.addIndex('rooms', ['hotelId', 'status'], {
      name: 'idx_rooms_hotelId_status',
    });

    // Add unique constraint for room number within a hotel
    await queryInterface.addIndex('rooms', ['hotelId', 'roomNumber'], {
      name: 'idx_rooms_hotelId_roomNumber',
      unique: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove indexes first
    await queryInterface.removeIndex('rooms', 'idx_rooms_roomNumber');
    await queryInterface.removeIndex('rooms', 'idx_rooms_hotelId');
    await queryInterface.removeIndex('rooms', 'idx_rooms_roomTypeId');
    await queryInterface.removeIndex('rooms', 'idx_rooms_status');
    await queryInterface.removeIndex('rooms', 'idx_rooms_isSmokingAllowed');
    await queryInterface.removeIndex('rooms', 'idx_rooms_isPetFriendly');
    await queryInterface.removeIndex('rooms', 'idx_rooms_hasWiFi');
    await queryInterface.removeIndex('rooms', 'idx_rooms_hasAirConditioning');
    await queryInterface.removeIndex('rooms', 'idx_rooms_roomTypeId_status');
    await queryInterface.removeIndex('rooms', 'idx_rooms_hotelId_status');
    await queryInterface.removeIndex('rooms', 'idx_rooms_hotelId_roomNumber');

    // Drop table
    await queryInterface.dropTable('rooms');
  },
};
