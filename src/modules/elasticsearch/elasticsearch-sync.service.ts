import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ElasticsearchService } from './elasticsearch.service';
import { HotelService } from '../hotel/hotel.service';
import { HotelRepository } from '../hotel/hotel.repository';

@Injectable()
export class ElasticsearchSyncService {
  private readonly logger = new Logger(ElasticsearchSyncService.name);

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly hotelService: HotelService,
    private readonly hotelRepository: HotelRepository,
  ) {}

  /**
   * Sync hotels to Elasticsearch every hour
   * Runs at the beginning of every hour (00 minutes)
   */
  @Cron(CronExpression.EVERY_HOUR)
  async syncHotelsToElasticsearch(): Promise<void> {
    this.logger.log('🔄 Starting scheduled Elasticsearch sync for hotels...');

    try {
      // Check if Elasticsearch is available
      const isHealthy = await this.elasticsearchService.isHealthy();
      if (!isHealthy) {
        this.logger.error('❌ Elasticsearch is not available. Skipping sync.');
        return;
      }

      this.logger.log('📊 Fetching hotels from database...');

      // Fetch all active hotels from database
      const hotels = await this.hotelRepository.findAllForElasticsearch();
      this.logger.log(`✅ Found ${hotels.length} hotels to sync`);

      if (hotels.length === 0) {
        this.logger.log('ℹ️ No hotels to sync.');
        return;
      }

      // Create hotel index if it doesn't exist
      await this.elasticsearchService.createHotelIndex();
      this.logger.log('📝 Elasticsearch index created/verified');

      // Bulk index all hotels
      await this.elasticsearchService.bulkIndexHotels(hotels);
      this.logger.log(`✅ Successfully indexed ${hotels.length} hotels to Elasticsearch`);

      this.logger.log('🎉 Scheduled Elasticsearch sync completed successfully!');

    } catch (error) {
      this.logger.error('❌ Error during scheduled Elasticsearch sync:', error);
    }
  }

  /**
   * Sync hotels to Elasticsearch every day at 2 AM
   * Useful for full reindexing during off-peak hours
   */
  @Cron('0 2 * * *') // Every day at 2:00 AM
  async dailyFullSync(): Promise<void> {
    this.logger.log('🔄 Starting daily full Elasticsearch sync for hotels...');

    try {
      // Check if Elasticsearch is available
      const isHealthy = await this.elasticsearchService.isHealthy();
      if (!isHealthy) {
        this.logger.error('❌ Elasticsearch is not available. Skipping daily sync.');
        return;
      }

      this.logger.log('📊 Fetching all hotels from database for daily sync...');

      // Fetch all hotels (no limit for daily sync)
      const hotels = await this.hotelRepository.findAllForElasticsearch();
      this.logger.log(`✅ Found ${hotels.length} hotels for daily sync`);

      if (hotels.length === 0) {
        this.logger.log('ℹ️ No hotels to sync.');
        return;
      }

      // Create hotel index if it doesn't exist
      await this.elasticsearchService.createHotelIndex();
      this.logger.log('📝 Elasticsearch index created/verified for daily sync');

      // Bulk index all hotels
      await this.elasticsearchService.bulkIndexHotels(hotels);
      this.logger.log(`✅ Successfully indexed ${hotels.length} hotels to Elasticsearch in daily sync`);

      this.logger.log('🎉 Daily full Elasticsearch sync completed successfully!');

    } catch (error) {
      this.logger.error('❌ Error during daily full Elasticsearch sync:', error);
    }
  }

  /**
   * Manual trigger for immediate sync
   * Can be called via API or other services
   */
  async triggerManualSync(): Promise<{ success: boolean; message: string; hotelsSynced?: number }> {
    this.logger.log('🔄 Starting manual Elasticsearch sync for hotels...');

    try {
      // Check if Elasticsearch is available
      const isHealthy = await this.elasticsearchService.isHealthy();
      if (!isHealthy) {
        this.logger.error('❌ Elasticsearch is not available.');
        return { success: false, message: 'Elasticsearch is not available' };
      }

      this.logger.log('📊 Fetching hotels from database for manual sync...');

      // Fetch all active hotels from database
      const hotels = await this.hotelRepository.findAllForElasticsearch();
      this.logger.log(`✅ Found ${hotels.length} hotels to sync`);

      if (hotels.length === 0) {
        this.logger.log('ℹ️ No hotels to sync.');
        return { success: true, message: 'No hotels to sync', hotelsSynced: 0 };
      }

      // Create hotel index if it doesn't exist
      await this.elasticsearchService.createHotelIndex();
      this.logger.log('📝 Elasticsearch index created/verified');

      // Bulk index all hotels
      await this.elasticsearchService.bulkIndexHotels(hotels);
      this.logger.log(`✅ Successfully indexed ${hotels.length} hotels to Elasticsearch`);

      this.logger.log('🎉 Manual Elasticsearch sync completed successfully!');

      return {
        success: true,
        message: `Successfully synced ${hotels.length} hotels to Elasticsearch`,
        hotelsSynced: hotels.length
      };

    } catch (error) {
      this.logger.error('❌ Error during manual Elasticsearch sync:', error);
      return { success: false, message: 'Error during sync process' };
    }
  }
}
