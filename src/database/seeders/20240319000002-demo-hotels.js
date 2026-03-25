'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if hotels already exist
    const existingHotels = await queryInterface.select(null, 'hotels', {
      where: {
        name: {
          [Sequelize.Op.in]: ['Grand Plaza Hotel', 'Seaside Resort', 'Mountain Lodge'],
        },
      },
    });

    const existingNames = existingHotels.map(hotel => hotel.name);
    const hotelsToInsert = [
      {
        name: 'Grand Plaza Hotel',
        location: 'New York, NY',
        price: 250.00,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Seaside Resort',
        location: 'Miami, FL',
        price: 180.00,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Mountain Lodge',
        location: 'Denver, CO',
        price: 120.00,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ].filter(hotel => !existingNames.includes(hotel.name));

    if (hotelsToInsert.length > 0) {
      await queryInterface.bulkInsert('hotels', hotelsToInsert);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('hotels', {
      name: {
        [Sequelize.Op.in]: ['Grand Plaza Hotel', 'Seaside Resort', 'Mountain Lodge'],
      },
    });
  },
};
