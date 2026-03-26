import { Injectable, Logger, Inject } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
import { SearchHotelsInput } from '../hotel/dto/hotel.input';
import { ELASTICSEARCH_CLIENT } from './elasticsearch.module';

export interface HotelSearchResult {
  hits: {
    hits: Array<{
      _source: any;
      _score: number;
    }>;
    total: {
      value: number;
    };
  };
}

@Injectable()
export class ElasticsearchService {
  private readonly logger = new Logger(ElasticsearchService.name);
  private readonly hotelIndex = 'hotels';

  constructor(@Inject(ELASTICSEARCH_CLIENT) private readonly client: Client) {}

  /**
   * Check if Elasticsearch is available
   */
  async isHealthy(): Promise<boolean> {
    try {
      await this.client.ping();
      return true;
    } catch (error) {
      this.logger.error('Elasticsearch is not available', error);
      return false;
    }
  }

  /**
   * Create hotel index with proper mapping
   */
  async createHotelIndex(): Promise<void> {
    try {
      const exists = await this.client.indices.exists({
        index: this.hotelIndex,
      });

      if (exists) {
        this.logger.log(`Index ${this.hotelIndex} already exists`);
        return;
      }

      await this.client.indices.create({
        index: this.hotelIndex,
        mappings: {
          properties: {
            id: { type: 'integer' },
            name: { 
              type: 'text',
              analyzer: 'standard',
              fields: {
                keyword: { type: 'keyword' }
              }
            },
            description: { 
              type: 'text',
              analyzer: 'standard'
            },
            address: { 
              type: 'text',
              analyzer: 'standard'
            },
            city: { 
              type: 'text',
              analyzer: 'standard',
              fields: {
                keyword: { type: 'keyword' }
              }
            },
            state: { 
              type: 'text',
              analyzer: 'standard',
              fields: {
                keyword: { type: 'keyword' }
              }
            },
            country: { 
              type: 'text',
              analyzer: 'standard',
              fields: {
                keyword: { type: 'keyword' }
              }
            },
            rating: { type: 'float' },
            totalReviews: { type: 'integer' },
            mealPlan: { type: 'keyword' },
            propertyType: { type: 'keyword' },
            amenities: { type: 'keyword' },
            minPrice: { type: 'float' },
            maxPrice: { type: 'float' },
            isActive: { type: 'boolean' },
            ownerId: { type: 'integer' },
            createdAt: { type: 'date' },
            updatedAt: { type: 'date' },
          },
        },
      });

      this.logger.log(`Created index ${this.hotelIndex}`);
    } catch (error) {
      this.logger.error(`Failed to create index ${this.hotelIndex}`, error);
      throw error;
    }
  }

  /**
   * Index a single hotel
   */
  async indexHotel(hotel: any): Promise<void> {
    try {
      await this.client.index({
        index: this.hotelIndex,
        id: hotel.id.toString(),
        body: hotel,
      });
    } catch (error) {
      this.logger.error(`Failed to index hotel ${hotel.id}`, error);
      throw error;
    }
  }

  /**
   * Bulk index hotels
   */
  async bulkIndexHotels(hotels: any[]): Promise<void> {
    try {
      const body = hotels.flatMap(hotel => [
        { index: { _index: this.hotelIndex, _id: hotel.id.toString() } },
        hotel,
      ]);

      await this.client.bulk({ body });
      this.logger.log(`Bulk indexed ${hotels.length} hotels`);
    } catch (error) {
      this.logger.error('Failed to bulk index hotels', error);
      throw error;
    }
  }

  /**
   * Search hotels using Elasticsearch
   */
  async searchHotels(searchInput: SearchHotelsInput): Promise<HotelSearchResult> {
    try {
      const query: any = {
        bool: {
          must: [{ term: { isActive: true } }],
        },
      };

      // Full-text search across multiple fields
      if (searchInput.searchQuery) {
        query.bool.must.push({
          multi_match: {
            query: searchInput.searchQuery,
            fields: [
              'name^3',           // Higher weight for name
              'city^2',           // Higher weight for city
              'state^2',          // Higher weight for state
              'country^2',        // Higher weight for country
              'description',
              'address',
            ],
            type: 'best_fields',
            fuzziness: 'AUTO',
          },
        });
      }

      // Location filters
      if (searchInput.city) {
        query.bool.filter = query.bool.filter || [];
        query.bool.filter.push({
          term: { 'city.keyword': searchInput.city },
        });
      }

      if (searchInput.state) {
        query.bool.filter = query.bool.filter || [];
        query.bool.filter.push({
          term: { 'state.keyword': searchInput.state },
        });
      }

      if (searchInput.country) {
        query.bool.filter = query.bool.filter || [];
        query.bool.filter.push({
          term: { 'country.keyword': searchInput.country },
        });
      }

      // Rating filters
      if (searchInput.minRating !== undefined || searchInput.maxRating !== undefined) {
        const ratingRange: any = {};
        if (searchInput.minRating !== undefined) {
          ratingRange.gte = searchInput.minRating;
        }
        if (searchInput.maxRating !== undefined) {
          ratingRange.lte = searchInput.maxRating;
        }
        query.bool.filter = query.bool.filter || [];
        query.bool.filter.push({
          range: { rating: ratingRange },
        });
      }

      // Price filters
      if (searchInput.minPrice !== undefined || searchInput.maxPrice !== undefined) {
        const priceRange: any = {};
        if (searchInput.minPrice !== undefined) {
          priceRange.gte = searchInput.minPrice;
        }
        if (searchInput.maxPrice !== undefined) {
          priceRange.lte = searchInput.maxPrice;
        }
        query.bool.filter = query.bool.filter || [];
        query.bool.filter.push({
          range: { minPrice: priceRange },
        });
      }

      // Meal plan filter
      if (searchInput.mealPlan) {
        query.bool.filter = query.bool.filter || [];
        query.bool.filter.push({
          term: { mealPlan: searchInput.mealPlan },
        });
      }

      // Property type filter
      if (searchInput.propertyType) {
        query.bool.filter = query.bool.filter || [];
        query.bool.filter.push({
          term: { propertyType: searchInput.propertyType },
        });
      }

      // Amenities filter
      if (searchInput.amenities && searchInput.amenities.length > 0) {
        query.bool.filter = query.bool.filter || [];
        query.bool.filter.push({
          terms: { amenities: searchInput.amenities },
        });
      }

      const searchParams: any = {
        index: this.hotelIndex,
        body: {
          query,
          sort: [
            { rating: { order: 'desc' } },
            { totalReviews: { order: 'desc' } },
            { _score: { order: 'desc' } },
          ],
        },
      };

      // Add pagination
      if (searchInput.offset !== undefined) {
        searchParams.body.from = searchInput.offset;
      }
      if (searchInput.limit !== undefined) {
        searchParams.body.size = searchInput.limit;
      }

      const response = await this.client.search(searchParams);
      return {
        hits: {
          hits: response.hits.hits.map(hit => ({
            _source: hit._source,
            _score: hit._score,
          })),
          total: {
            value: typeof response.hits.total === 'number' ? response.hits.total : response.hits.total.value,
          },
        },
      };
    } catch (error) {
      this.logger.error('Failed to search hotels in Elasticsearch', error);
      throw error;
    }
  }

  /**
   * Delete hotel from index
   */
  async deleteHotel(hotelId: number): Promise<void> {
    try {
      await this.client.delete({
        index: this.hotelIndex,
        id: hotelId.toString(),
      });
    } catch (error) {
      this.logger.error(`Failed to delete hotel ${hotelId} from index`, error);
      throw error;
    }
  }

  /**
   * Get hotel by ID from Elasticsearch
   */
  async getHotelById(hotelId: number): Promise<any> {
    try {
      const response = await this.client.get({
        index: this.hotelIndex,
        id: hotelId.toString(),
      });
      return response._source;
    } catch (error) {
      this.logger.error(`Failed to get hotel ${hotelId} from Elasticsearch`, error);
      return null;
    }
  }
}
