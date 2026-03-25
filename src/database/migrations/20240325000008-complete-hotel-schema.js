'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add missing columns to hotels table based on current model
    // Note: id, name, createdAt, updatedAt already exist from initial migration
    
    // Replace 'location' and 'price' with proper fields
    await queryInterface.removeColumn('hotels', 'location');
    await queryInterface.removeColumn('hotels', 'price');

    // Add address fields
    await queryInterface.addColumn('hotels', 'description', {
      type: Sequelize.TEXT,
      allowNull: false,
    });

    await queryInterface.addColumn('hotels', 'address', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn('hotels', 'city', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn('hotels', 'state', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn('hotels', 'country', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn('hotels', 'postalCode', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    // Add coordinates
    await queryInterface.addColumn('hotels', 'latitude', {
      type: Sequelize.DECIMAL(10, 8),
      allowNull: false,
    });

    await queryInterface.addColumn('hotels', 'longitude', {
      type: Sequelize.DECIMAL(11, 8),
      allowNull: false,
    });

    // Add contact information
    await queryInterface.addColumn('hotels', 'phone', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('hotels', 'email', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('hotels', 'website', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Add rating and reviews
    await queryInterface.addColumn('hotels', 'rating', {
      type: Sequelize.DECIMAL(3, 2),
      allowNull: false,
      defaultValue: 0.0,
    });

    await queryInterface.addColumn('hotels', 'totalReviews', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });

    // Add status fields
    await queryInterface.addColumn('hotels', 'isActive', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });

    await queryInterface.addColumn('hotels', 'isVerified', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    // Add hotel policy fields
    await queryInterface.addColumn('hotels', 'mealPlan', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('hotels', 'propertyType', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('hotels', 'checkInTime', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('hotels', 'checkOutTime', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('hotels', 'cancellationPolicy', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn('hotels', 'petPolicy', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn('hotels', 'parkingInfo', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    // Add owner relationship
    await queryInterface.addColumn('hotels', 'ownerId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    // Add indexes for performance
    await queryInterface.addIndex('hotels', ['address'], {
      name: 'idx_hotels_address',
    });

    await queryInterface.addIndex('hotels', ['city'], {
      name: 'idx_hotels_city',
    });

    await queryInterface.addIndex('hotels', ['state'], {
      name: 'idx_hotels_state',
    });

    await queryInterface.addIndex('hotels', ['country'], {
      name: 'idx_hotels_country',
    });

    await queryInterface.addIndex('hotels', ['rating'], {
      name: 'idx_hotels_rating',
    });

    await queryInterface.addIndex('hotels', ['isActive'], {
      name: 'idx_hotels_isActive',
    });

    await queryInterface.addIndex('hotels', ['ownerId'], {
      name: 'idx_hotels_ownerId',
    });

    // Composite indexes for common searches
    await queryInterface.addIndex('hotels', ['city', 'isActive'], {
      name: 'idx_hotels_city_isActive',
    });

    await queryInterface.addIndex('hotels', ['rating', 'isActive'], {
      name: 'idx_hotels_rating_isActive',
    });

    // Remove old indexes
    await queryInterface.removeIndex('hotels', 'hotels_name_index');
    await queryInterface.removeIndex('hotels', 'hotels_location_index');

    // Add new name index
    await queryInterface.addIndex('hotels', ['name'], {
      name: 'idx_hotels_name',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove indexes first
    await queryInterface.removeIndex('hotels', 'idx_hotels_address');
    await queryInterface.removeIndex('hotels', 'idx_hotels_city');
    await queryInterface.removeIndex('hotels', 'idx_hotels_state');
    await queryInterface.removeIndex('hotels', 'idx_hotels_country');
    await queryInterface.removeIndex('hotels', 'idx_hotels_rating');
    await queryInterface.removeIndex('hotels', 'idx_hotels_isActive');
    await queryInterface.removeIndex('hotels', 'idx_hotels_ownerId');
    await queryInterface.removeIndex('hotels', 'idx_hotels_city_isActive');
    await queryInterface.removeIndex('hotels', 'idx_hotels_rating_isActive');
    await queryInterface.removeIndex('hotels', 'idx_hotels_name');

    // Remove columns in reverse order
    await queryInterface.removeColumn('hotels', 'ownerId');
    await queryInterface.removeColumn('hotels', 'parkingInfo');
    await queryInterface.removeColumn('hotels', 'petPolicy');
    await queryInterface.removeColumn('hotels', 'cancellationPolicy');
    await queryInterface.removeColumn('hotels', 'checkOutTime');
    await queryInterface.removeColumn('hotels', 'checkInTime');
    await queryInterface.removeColumn('hotels', 'propertyType');
    await queryInterface.removeColumn('hotels', 'mealPlan');
    await queryInterface.removeColumn('hotels', 'isVerified');
    await queryInterface.removeColumn('hotels', 'isActive');
    await queryInterface.removeColumn('hotels', 'totalReviews');
    await queryInterface.removeColumn('hotels', 'rating');
    await queryInterface.removeColumn('hotels', 'website');
    await queryInterface.removeColumn('hotels', 'email');
    await queryInterface.removeColumn('hotels', 'phone');
    await queryInterface.removeColumn('hotels', 'longitude');
    await queryInterface.removeColumn('hotels', 'latitude');
    await queryInterface.removeColumn('hotels', 'postalCode');
    await queryInterface.removeColumn('hotels', 'country');
    await queryInterface.removeColumn('hotels', 'state');
    await queryInterface.removeColumn('hotels', 'city');
    await queryInterface.removeColumn('hotels', 'address');
    await queryInterface.removeColumn('hotels', 'description');

    // Add back original columns
    await queryInterface.addColumn('hotels', 'location', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn('hotels', 'price', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    });

    // Add back original indexes
    await queryInterface.addIndex('hotels', ['name'], {
      name: 'hotels_name_index',
    });
    
    await queryInterface.addIndex('hotels', ['location'], {
      name: 'hotels_location_index',
    });
  },
};
