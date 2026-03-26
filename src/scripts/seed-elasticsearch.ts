import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ElasticsearchService } from '../modules/elasticsearch/elasticsearch.service';
import { HotelRepository } from '../modules/hotel/hotel.repository';
import { Hotel } from '../database/models/hotel.model';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const elasticsearchService = app.get(ElasticsearchService);
  const hotelRepository = app.get(HotelRepository);

  try {
    console.log('Starting Elasticsearch seeding...');

    // Check if Elasticsearch is available
    const isHealthy = await elasticsearchService.isHealthy();
    if (!isHealthy) {
      console.error('Elasticsearch is not available. Please ensure Elasticsearch is running.');
      process.exit(1);
    }

    // Create hotel index
    console.log('Creating hotel index...');
    await elasticsearchService.createHotelIndex();

    // Get all hotels from database
    console.log('Fetching hotels from database...');
    const hotels = await hotelRepository.findAllHotelsForElasticsearch();

    if (hotels.length === 0) {
      console.log('No hotels found in database. Skipping Elasticsearch seeding.');
      return;
    }

    // Prepare hotel data for Elasticsearch
    const hotelData = hotels.map((hotel: Hotel & { roomTypes?: any[], hotelAmenities?: any[] }) => {
      // Calculate min and max prices from room types
      const roomTypes = hotel.roomTypes || [];
      const prices = roomTypes.map((roomType: any) => roomType.basePrice).filter((price: number) => price != null);
      
      let minPrice = undefined;
      let maxPrice = undefined;
      
      if (prices.length > 0) {
        minPrice = Math.min(...prices);
        maxPrice = Math.max(...prices);
      }

      // Extract amenities from hotel amenities
      const hotelAmenities = hotel.hotelAmenities || [];
      const amenities = hotelAmenities.map((amenity: any) => amenity.amenity).filter(Boolean);

      return {
        id: hotel.id,
        name: hotel.name,
        description: hotel.description,
        address: hotel.address,
        city: hotel.city,
        state: hotel.state,
        country: hotel.country,
        rating: hotel.rating,
        totalReviews: hotel.totalReviews,
        mealPlan: hotel.mealPlan,
        propertyType: hotel.propertyType,
        amenities: amenities,
        minPrice: minPrice,
        maxPrice: maxPrice,
        isActive: hotel.isActive,
        ownerId: hotel.ownerId,
        createdAt: hotel.createdAt,
        updatedAt: hotel.updatedAt,
      };
    });

    // Bulk index hotels
    console.log(`Indexing ${hotelData.length} hotels in Elasticsearch...`);
    await elasticsearchService.bulkIndexHotels(hotelData);

    console.log('✅ Elasticsearch seeding completed successfully!');
  } catch (error) {
    console.error('❌ Failed to seed Elasticsearch:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap();
