import { Controller, Get, Post, Query } from '@nestjs/common';
import { ElasticsearchService } from './elasticsearch.service';
import { ElasticsearchSyncService } from './elasticsearch-sync.service';

@Controller('elasticsearch')
export class ElasticsearchController {
  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly elasticsearchSyncService: ElasticsearchSyncService,
  ) {}

  @Get('health')
  async checkHealth(): Promise<{ status: string; timestamp: string }> {
    const isHealthy = await this.elasticsearchService.isHealthy();
    return {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('create-index')
  async createHotelIndex(): Promise<{ message: string }> {
    await this.elasticsearchService.createHotelIndex();
    return { message: 'Hotel index created successfully' };
  }

  @Post('sync-hotels')
  async syncHotels(): Promise<{ success: boolean; message: string; hotelsSynced?: number }> {
    return this.elasticsearchSyncService.triggerManualSync();
  }

  @Get('sync-status')
  async getSyncStatus(): Promise<{ 
    elasticsearchHealthy: boolean; 
    lastSyncTime?: string;
    message: string;
  }> {
    const isHealthy = await this.elasticsearchService.isHealthy();
    return {
      elasticsearchHealthy: isHealthy,
      lastSyncTime: new Date().toISOString(), // In a real implementation, you'd store the last sync time
      message: isHealthy ? 'Elasticsearch is available for syncing' : 'Elasticsearch is not available',
    };
  }

  @Get('autocomplete')
  async autocomplete(@Query('q') query: string): Promise<{ suggestions: any[] }> {
    if (!query || query.trim().length < 2) {
      return { suggestions: [] };
    }

    const suggestions = await this.elasticsearchService.autocompleteHotelSearch(query.trim());
    return { suggestions };
  }

  @Get('advanced-autocomplete')
  async advancedAutocomplete(@Query('q') query: string): Promise<{ suggestions: any[] }> {
    if (!query || query.trim().length < 2) {
      return { suggestions: [] };
    }

    const suggestions = await this.elasticsearchService.advancedAutocomplete(query.trim());
    return { suggestions };
  }
}
