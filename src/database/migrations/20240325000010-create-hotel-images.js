'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('hotel_images', {
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
    await queryInterface.addIndex('hotel_images', ['hotelId'], {
      name: 'idx_hotel_images_hotelId',
    });

    await queryInterface.addIndex('hotel_images', ['isPrimary'], {
      name: 'idx_hotel_images_isPrimary',
    });

    await queryInterface.addIndex('hotel_images', ['sortOrder'], {
      name: 'idx_hotel_images_sortOrder',
    });

    // Composite index for primary image lookup
    await queryInterface.addIndex('hotel_images', ['hotelId', 'isPrimary'], {
      name: 'idx_hotel_images_hotelId_isPrimary',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove indexes first
    await queryInterface.removeIndex('hotel_images', 'idx_hotel_images_hotelId');
    await queryInterface.removeIndex('hotel_images', 'idx_hotel_images_isPrimary');
    await queryInterface.removeIndex('hotel_images', 'idx_hotel_images_sortOrder');
    await queryInterface.removeIndex('hotel_images', 'idx_hotel_images_hotelId_isPrimary');

    // Drop table
    await queryInterface.dropTable('hotel_images');
  },
};
