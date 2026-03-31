'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add publicId to hotel_images table
    await queryInterface.addColumn('hotel_images', 'publicId', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Cloudinary public ID for deletion',
    });

    // Add publicId to room_type_images table
    await queryInterface.addColumn('room_type_images', 'publicId', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Cloudinary public ID for deletion',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove publicId from hotel_images table
    await queryInterface.removeColumn('hotel_images', 'publicId');

    // Remove publicId from room_type_images table
    await queryInterface.removeColumn('room_type_images', 'publicId');
  },
};
