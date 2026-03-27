import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ElasticsearchSyncService } from './elasticsearch-sync.service';
import { ElasticsearchService } from './elasticsearch.service';

@Resolver()
export class ElasticsearchResolver {
  constructor(
    private readonly elasticsearchSyncService: ElasticsearchSyncService,
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  @Query(() => String, { name: 'elasticsearchHealth' })
  async checkHealth(): Promise<string> {
    const isHealthy = await this.elasticsearchService.isHealthy();
    return isHealthy ? 'healthy' : 'unhealthy';
  }

  @Query(() => String, { name: 'elasticsearchSyncStatus' })
  async getSyncStatus(): Promise<string> {
    const isHealthy = await this.elasticsearchService.isHealthy();
    return isHealthy ? 'Elasticsearch is available for syncing' : 'Elasticsearch is not available';
  }

  @Mutation(() => String, { name: 'syncHotelsToElasticsearch' })
  async syncHotels(): Promise<string> {
    const result = await this.elasticsearchSyncService.triggerManualSync();
    return result.message;
  }

  @Mutation(() => String, { name: 'createHotelIndex' })
  async createHotelIndex(): Promise<string> {
    await this.elasticsearchService.createHotelIndex();
    return 'Hotel index created successfully';
  }

  @Query(() => [String], { name: 'hotelAutocomplete' })
  async hotelAutocomplete(@Args('query') query: string): Promise<string[]> {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const suggestions = await this.elasticsearchService.autocompleteHotelSearch(query.trim());
    return suggestions.map(suggestion => suggestion.text);
  }

  @Query(() => [String], { name: 'advancedHotelAutocomplete' })
  async advancedHotelAutocomplete(@Args('query') query: string): Promise<string[]> {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const suggestions = await this.elasticsearchService.advancedAutocomplete(query.trim());
    return suggestions.map(suggestion => suggestion.text);
  }
}
