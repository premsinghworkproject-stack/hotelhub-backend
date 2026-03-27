import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ElasticsearchService } from '../modules/elasticsearch/elasticsearch.service';
import { HotelService } from '../modules/hotel/hotel.service';
import { ConfigService } from '@nestjs/config';

async function syncElasticsearch() {
  console.log('🔄 Starting Elasticsearch sync...');
  
  const app = await NestFactory.create(AppModule);
  const elasticsearchService = app.get(ElasticsearchService);
  const hotelService = app.get(HotelService);
  const configService = app.get(ConfigService);

  try {
    // Check if Elasticsearch is available
    const isHealthy = await elasticsearchService.isHealthy();
    if (!isHealthy) {
      console.log('❌ Elasticsearch is not available. Please start Elasticsearch server.');
      process.exit(1);
    }

    console.log('📊 Fetching hotels from database...');
    
    // Fetch all active hotels from database
    const hotels = await hotelService.findAll(1000, 0); // Get up to 1000 hotels
    console.log(`✅ Found ${hotels.length} hotels to sync`);

    if (hotels.length === 0) {
      console.log('ℹ️ No hotels to sync. Exiting.');
      await app.close();
      return;
    }

    // Create hotel index if it doesn't exist
    await elasticsearchService.createHotelIndex();
    console.log('📝 Elasticsearch index created/verified');

    // Bulk index all hotels
    await elasticsearchService.bulkIndexHotels(hotels);
    console.log(`✅ Successfully indexed ${hotels.length} hotels to Elasticsearch`);

    console.log('🎉 Elasticsearch sync completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during Elasticsearch sync:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

syncElasticsearch();
