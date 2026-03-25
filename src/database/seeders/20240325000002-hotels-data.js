'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, get the hotel owner user ID
    const [userResult] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email = 'jane.smith@yopmail.com' LIMIT 1`
    );
    
    const hotelOwnerId = userResult[0]?.id;
    
    if (!hotelOwnerId) {
      console.log('Hotel owner user not found. Please run user seeder first.');
      return;
    }

    // Hotels data
    const hotels = [
      {
        name: 'Grand Plaza Hotel',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        postalCode: '10001',
        phone: '+1-555-0123',
        email: 'info@grandplaza.com',
        website: 'https://grandplaza.com',
        description: 'Luxury hotel in downtown Manhattan with stunning city views and world-class amenities',
        latitude: 40.7128,
        longitude: -74.0060,
        rating: 4.5,
        totalReviews: 1250,
        mealPlan: 'BED_AND_BREAKFAST',
        propertyType: 'HOTEL',
        checkInTime: '15:00',
        checkOutTime: '11:00',
        cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
        petPolicy: 'Pets allowed with additional fee',
        parkingInfo: 'Valet parking available - $45 per day',
        isActive: true,
        ownerId: hotelOwnerId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Seaside Resort & Spa',
        address: '456 Ocean Boulevard',
        city: 'Miami',
        state: 'FL',
        country: 'USA',
        postalCode: '33101',
        phone: '+1-555-0456',
        email: 'info@seasideresort.com',
        website: 'https://seasideresort.com',
        description: 'Beachfront luxury resort with full-service spa, multiple pools, and oceanfront dining',
        latitude: 25.7617,
        longitude: -80.1918,
        rating: 4.7,
        totalReviews: 890,
        mealPlan: 'ALL_INCLUSIVE',
        propertyType: 'RESORT',
        checkInTime: '16:00',
        checkOutTime: '12:00',
        cancellationPolicy: 'Free cancellation up to 48 hours before check-in',
        petPolicy: 'No pets allowed',
        parkingInfo: 'Free self-parking available',
        isActive: true,
        ownerId: hotelOwnerId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Mountain View Lodge',
        address: '789 Alpine Road',
        city: 'Aspen',
        state: 'CO',
        country: 'USA',
        postalCode: '81611',
        phone: '+1-555-0789',
        email: 'info@mountainview.com',
        website: 'https://mountainview.com',
        description: 'Cozy mountain lodge with ski-in/ski-out access and rustic charm',
        latitude: 39.1911,
        longitude: -106.8175,
        rating: 4.3,
        totalReviews: 567,
        mealPlan: 'HALF_BOARD',
        propertyType: 'HOTEL',
        checkInTime: '15:00',
        checkOutTime: '11:00',
        cancellationPolicy: 'Free cancellation up to 72 hours before check-in',
        petPolicy: 'Pets welcome - no fee',
        parkingInfo: 'Free parking included',
        isActive: true,
        ownerId: hotelOwnerId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    // Insert hotels with upsert behavior
    for (const hotel of hotels) {
      const [existingHotel] = await queryInterface.sequelize.query(
        `SELECT id FROM hotels WHERE name = :name LIMIT 1`,
        {
          replacements: { name: hotel.name },
          type: Sequelize.QueryTypes.SELECT
        }
      );

      if (!existingHotel || existingHotel.length === 0) {
        await queryInterface.bulkInsert('hotels', [hotel]);
        console.log(`✅ Created hotel: ${hotel.name}`);
      } else {
        console.log(`⚠️  Hotel already exists: ${hotel.name}`);
      }
    }

    // Get the inserted hotel IDs manually
    const grandPlazaHotel = await queryInterface.sequelize.query(
      `SELECT id FROM hotels WHERE name = 'Grand Plaza Hotel' LIMIT 1`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    const seasideResort = await queryInterface.sequelize.query(
      `SELECT id FROM hotels WHERE name = 'Seaside Resort & Spa' LIMIT 1`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    const mountainLodge = await queryInterface.sequelize.query(
      `SELECT id FROM hotels WHERE name = 'Mountain View Lodge' LIMIT 1`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    const hotelIds = {
      'Grand Plaza Hotel': grandPlazaHotel[0]?.id || hotelOwnerId,
      'Seaside Resort & Spa': seasideResort[0]?.id || hotelOwnerId,
      'Mountain View Lodge': mountainLodge[0]?.id || hotelOwnerId
    };

    // Room Types for each hotel
    const roomTypes = [];
    
    // Grand Plaza Hotel Room Types
    roomTypes.push(
      {
        name: 'Standard Room',
        description: 'Comfortable room with city view, perfect for business travelers',
        basePrice: 150.00,
        maxOccupancy: 2,
        adults: 2,
        children: 0,
        amenities: JSON.stringify(['WiFi', 'AirConditioning', 'TV', 'WorkDesk', 'Safe', 'MiniBar']),
        isActive: true,
        hotelId: hotelIds['Grand Plaza Hotel'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Deluxe Suite',
        description: 'Spacious suite with separate living area and panoramic city views',
        basePrice: 280.00,
        maxOccupancy: 4,
        adults: 2,
        children: 2,
        amenities: JSON.stringify(['WiFi', 'AirConditioning', 'TV', 'WorkDesk', 'Safe', 'MiniBar', 'Balcony', 'Kitchenette']),
        isActive: true,
        hotelId: hotelIds['Grand Plaza Hotel'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Executive Suite',
        description: 'Luxury suite with premium amenities and concierge service',
        basePrice: 450.00,
        maxOccupancy: 4,
        adults: 2,
        children: 2,
        amenities: JSON.stringify(['WiFi', 'AirConditioning', 'TV', 'WorkDesk', 'Safe', 'MiniBar', 'Balcony', 'Kitchenette', 'Bathtub', 'Heating']),
        isActive: true,
        hotelId: hotelIds['Grand Plaza Hotel'],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    );

    // Seaside Resort Room Types
    roomTypes.push(
      {
        name: 'Garden View Room',
        description: 'Comfortable room overlooking the resort gardens',
        basePrice: 200.00,
        maxOccupancy: 2,
        adults: 2,
        children: 1,
        amenities: JSON.stringify(['WiFi', 'AirConditioning', 'TV', 'MiniBar', 'Safe', 'Balcony']),
        isActive: true,
        hotelId: hotelIds['Seaside Resort & Spa'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Ocean Front Suite',
        description: 'Luxury suite with direct ocean views and private balcony',
        basePrice: 380.00,
        maxOccupancy: 4,
        adults: 2,
        children: 2,
        amenities: JSON.stringify(['WiFi', 'AirConditioning', 'TV', 'MiniBar', 'Safe', 'Balcony', 'Kitchenette', 'Bathtub', 'Shower']),
        isActive: true,
        hotelId: hotelIds['Seaside Resort & Spa'],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    );

    // Mountain View Lodge Room Types
    roomTypes.push(
      {
        name: 'Alpine Room',
        description: 'Cozy room with mountain views and rustic decor',
        basePrice: 120.00,
        maxOccupancy: 2,
        adults: 2,
        children: 0,
        amenities: JSON.stringify(['WiFi', 'Heating', 'TV', 'WorkDesk', 'Safe']),
        isActive: true,
        hotelId: hotelIds['Mountain View Lodge'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Mountain Suite',
        description: 'Spacious suite with panoramic mountain views and fireplace',
        basePrice: 250.00,
        maxOccupancy: 4,
        adults: 2,
        children: 2,
        amenities: JSON.stringify(['WiFi', 'Heating', 'TV', 'WorkDesk', 'Safe', 'Kitchenette', 'Balcony', 'Fireplace']),
        isActive: true,
        hotelId: hotelIds['Mountain View Lodge'],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    );

    // Insert room types with upsert behavior
    for (const roomType of roomTypes) {
      const [existingRoomType] = await queryInterface.sequelize.query(
        `SELECT id FROM room_types WHERE name = :name AND "hotelId" = :hotelId LIMIT 1`,
        {
          replacements: { name: roomType.name, hotelId: roomType.hotelId },
          type: Sequelize.QueryTypes.SELECT
        }
      );

      if (!existingRoomType || existingRoomType.length === 0) {
        await queryInterface.bulkInsert('room_types', [roomType]);
        console.log(`✅ Created room type: ${roomType.name}`);
      } else {
        console.log(`⚠️  Room type already exists: ${roomType.name}`);
      }
    }

    // Get the inserted room type IDs manually
    const standardRoom = await queryInterface.sequelize.query(
      `SELECT id FROM room_types WHERE name = 'Standard Room' LIMIT 1`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    const deluxeSuite = await queryInterface.sequelize.query(
      `SELECT id FROM room_types WHERE name = 'Deluxe Suite' LIMIT 1`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    const executiveSuite = await queryInterface.sequelize.query(
      `SELECT id FROM room_types WHERE name = 'Executive Suite' LIMIT 1`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    const gardenViewRoom = await queryInterface.sequelize.query(
      `SELECT id FROM room_types WHERE name = 'Garden View Room' LIMIT 1`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    const oceanFrontSuite = await queryInterface.sequelize.query(
      `SELECT id FROM room_types WHERE name = 'Ocean Front Suite' LIMIT 1`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    const alpineRoom = await queryInterface.sequelize.query(
      `SELECT id FROM room_types WHERE name = 'Alpine Room' LIMIT 1`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    const mountainSuite = await queryInterface.sequelize.query(
      `SELECT id FROM room_types WHERE name = 'Mountain Suite' LIMIT 1`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    const roomTypeIds = {
      'Standard Room': standardRoom[0]?.id || 1,
      'Deluxe Suite': deluxeSuite[0]?.id || 2,
      'Executive Suite': executiveSuite[0]?.id || 3,
      'Garden View Room': gardenViewRoom[0]?.id || 4,
      'Ocean Front Suite': oceanFrontSuite[0]?.id || 5,
      'Alpine Room': alpineRoom[0]?.id || 6,
      'Mountain Suite': mountainSuite[0]?.id || 7
    };

    // Rooms for each room type
    const rooms = [];
    let roomNumberCounter = 100;

    // Add rooms for each room type
    for (let i = 0; i < roomTypes.length; i++) {
      const roomType = roomTypes[i];
      const roomsPerType = i === 0 ? 5 : 3; // More rooms for first room type
      const roomTypeId = roomTypeIds[roomType.name];

      for (let j = 0; j < roomsPerType; j++) {
        const floor = Math.floor(roomNumberCounter / 100) + 1;
        const isAvailable = j < roomsPerType - 1; // Keep one room for maintenance

        rooms.push({
          roomNumber: roomNumberCounter.toString(),
          floor: floor.toString(),
          customPrice: j === 0 ? roomType.basePrice * 1.2 : null, // First room has premium price
          description: `${roomType.name} - Room ${roomNumberCounter}`,
          notes: j === 0 ? 'Premium room with better view' : null,
          status: isAvailable ? 'AVAILABLE' : 'MAINTENANCE',
          isSmokingAllowed: false,
          isPetFriendly: roomType.name.includes('Garden') || roomType.name.includes('Alpine'),
          hasMinibar: roomType.amenities.includes('MiniBar'),
          hasSafe: roomType.amenities.includes('Safe'),
          hasBalcony: roomType.amenities.includes('Balcony'),
          hasBathtub: roomType.amenities.includes('Bathtub'),
          hasShower: roomType.amenities.includes('Shower'),
          hasKitchenette: roomType.amenities.includes('Kitchenette'),
          hasWorkDesk: roomType.amenities.includes('WorkDesk'),
          hasTV: roomType.amenities.includes('TV'),
          hasWiFi: roomType.amenities.includes('WiFi'),
          hasAirConditioning: roomType.amenities.includes('AirConditioning'),
          hasHeating: roomType.amenities.includes('Heating'),
          hotelId: roomType.hotelId,
          roomTypeId: roomTypeId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        roomNumberCounter++;
      }
    }

    // Insert rooms with upsert behavior
    for (const room of rooms) {
      const [existingRoom] = await queryInterface.sequelize.query(
        `SELECT id FROM rooms WHERE "roomNumber" = :roomNumber AND "hotelId" = :hotelId LIMIT 1`,
        {
          replacements: { roomNumber: room.roomNumber, hotelId: room.hotelId },
          type: Sequelize.QueryTypes.SELECT
        }
      );

      if (!existingRoom || existingRoom.length === 0) {
        await queryInterface.bulkInsert('rooms', [room]);
        console.log(`✅ Created room: ${room.roomNumber}`);
      } else {
        console.log(`⚠️  Room already exists: ${room.roomNumber}`);
      }
    }

    console.log(`✅ Seeded ${hotels.length} hotels, ${roomTypes.length} room types, and ${rooms.length} rooms`);
  },

  down: async (queryInterface, Sequelize) => {
    // Delete rooms first (foreign key constraint)
    await queryInterface.bulkDelete('rooms', {}, {});
    
    // Delete room types
    await queryInterface.bulkDelete('room_types', {}, {});
    
    // Delete hotels (only the ones we created)
    await queryInterface.bulkDelete('hotels', {
      name: ['Grand Plaza Hotel', 'Seaside Resort & Spa', 'Mountain View Lodge']
    });
  }
};
