import { Controller, Get } from '@nestjs/common';
import { ElasticsearchService } from './elasticsearch.service';

@Controller('elasticsearch')
export class ElasticsearchController {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

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
}
