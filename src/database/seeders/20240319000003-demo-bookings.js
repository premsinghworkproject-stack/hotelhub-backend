'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Get user and hotel IDs
    const users = await queryInterface.select(null, 'users', {
      where: {
        email: {
          [Sequelize.Op.in]: ['john.doe@example.com', 'jane.smith@example.com', 'bob.johnson@example.com'],
        },
      },
    });
    
    const hotels = await queryInterface.select(null, 'hotels', {
      where: {
        name: {
          [Sequelize.Op.in]: ['Grand Plaza Hotel', 'Seaside Resort', 'Mountain Lodge'],
        },
      },
    });
    
    // Check if bookings already exist for these users/hotels
    const existingBookings = await queryInterface.select(null, 'bookings', {
      where: {
        [Sequelize.Op.or]: [
          {
            userId: users[0]?.id,
            hotelId: hotels[0]?.id,
          },
          {
            userId: users[1]?.id,
            hotelId: hotels[1]?.id,
          },
          {
            userId: users[2]?.id,
            hotelId: hotels[2]?.id,
          },
        ],
      },
    });
    
    const existingKeys = existingBookings.map(booking => `${booking.userId}-${booking.hotelId}`);
    const checkInDate = new Date();
    
    const bookingsToInsert = [
      {
        userId: users[0]?.id || 1,
        hotelId: hotels[0]?.id || 1,
        checkIn: checkInDate,
        checkOut: new Date(checkInDate.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days later
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: users[1]?.id || 2,
        hotelId: hotels[1]?.id || 2,
        checkIn: new Date(checkInDate.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days later
        checkOut: new Date(checkInDate.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 days later
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: users[2]?.id || 3,
        hotelId: hotels[2]?.id || 3,
        checkIn: new Date(checkInDate.getTime() + 14 * 24 * 60 * 60 * 1000), // 14 days later
        checkOut: new Date(checkInDate.getTime() + 17 * 24 * 60 * 60 * 1000), // 17 days later
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ].filter(booking => !existingKeys.includes(`${booking.userId}-${booking.hotelId}`));

    if (bookingsToInsert.length > 0) {
      await queryInterface.bulkInsert('bookings', bookingsToInsert);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('bookings', {});
  },
};
