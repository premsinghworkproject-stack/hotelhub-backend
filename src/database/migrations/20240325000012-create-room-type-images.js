'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('room_type_images', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      altText: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      caption: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      isPrimary: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      sortOrder: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
    await queryInterface.addIndex('room_type_images', ['roomTypeId'], {
      name: 'idx_room_type_images_roomTypeId',
    });

    await queryInterface.addIndex('room_type_images', ['isPrimary'], {
      name: 'idx_room_type_images_isPrimary',
    });

    await queryInterface.addIndex('room_type_images', ['sortOrder'], {
      name: 'idx_room_type_images_sortOrder',
    });

    // Composite index for primary image lookup
    await queryInterface.addIndex('room_type_images', ['roomTypeId', 'isPrimary'], {
      name: 'idx_room_type_images_roomTypeId_isPrimary',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove indexes first
    await queryInterface.removeIndex('room_type_images', 'idx_room_type_images_roomTypeId');
    await queryInterface.removeIndex('room_type_images', 'idx_room_type_images_isPrimary');
    await queryInterface.removeIndex('room_type_images', 'idx_room_type_images_sortOrder');
    await queryInterface.removeIndex('room_type_images', 'idx_room_type_images_roomTypeId_isPrimary');

    // Drop table
    await queryInterface.dropTable('room_type_images');
  },
};
