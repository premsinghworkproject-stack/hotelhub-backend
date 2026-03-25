'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('room_type_amenities', {
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
    await queryInterface.addIndex('room_type_amenities', ['roomTypeId'], {
      name: 'idx_room_type_amenities_roomTypeId',
    });

    await queryInterface.addIndex('room_type_amenities', ['name'], {
      name: 'idx_room_type_amenities_name',
    });

    await queryInterface.addIndex('room_type_amenities', ['isAvailable'], {
      name: 'idx_room_type_amenities_isAvailable',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove indexes first
    await queryInterface.removeIndex('room_type_amenities', 'idx_room_type_amenities_roomTypeId');
    await queryInterface.removeIndex('room_type_amenities', 'idx_room_type_amenities_name');
    await queryInterface.removeIndex('room_type_amenities', 'idx_room_type_amenities_isAvailable');

    // Drop table
    await queryInterface.dropTable('room_type_amenities');
  },
};
