import { Injectable, Logger } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';

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
  private readonly client: Client;

  constructor() {
    this.client = new Client({
      node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',

      auth: process.env.ELASTICSEARCH_USERNAME
        ? {
          username: process.env.ELASTICSEARCH_USERNAME,
          password: process.env.ELASTICSEARCH_PASSWORD,
        }
        : undefined,

      maxRetries: 3,
      requestTimeout: 30000,

      sniffOnStart: false,
      sniffInterval: false,
      sniffOnConnectionFault: false,
    });

    this.logger.log('Elasticsearch client initialized');
  }

  /**
   * Check if Elasticsearch is available
   */
  async isHealthy(): Promise<boolean> {
    try {
      await this.client.info(); // ✅ safer
      return true;
    } catch (error) {
      this.logger.error('Elasticsearch is not available', error);
      return false;
    }
  }

  /**
   * Create hotel index with proper mapping (drops and recreates for fresh schema)
   */
  async createHotelIndex(): Promise<void> {
    try {
      // Check if index exists and drop it
      const exists = await this.client.indices.exists({
        index: this.hotelIndex,
      });

      if (exists) {
        this.logger.log(`Dropping existing index ${this.hotelIndex} for fresh recreation`);
        await this.client.indices.delete({
          index: this.hotelIndex,
        });
      }

      // Create fresh index with updated mapping
      await this.client.indices.create({
        index: this.hotelIndex,
        mappings: {
          properties: {
            id: { type: 'integer' },
            name: {
              type: 'text',
              analyzer: 'standard',
              fields: {
                keyword: { type: 'keyword' },
                suggest: {
                  type: 'completion'
                }
              }
            },
            description: {
              type: 'text',
              analyzer: 'standard',
              fields: {
                keyword: { type: 'keyword' },
                suggest: {
                  type: 'completion'
                }
              }
            },
            address: {
              type: 'text',
              analyzer: 'standard',
              fields: {
                keyword: { type: 'keyword' },
                suggest: {
                  type: 'completion'
                }
              }
            },
            city: {
              type: 'text',
              analyzer: 'standard',
              fields: {
                keyword: { type: 'keyword' },
                suggest: {
                  type: 'completion'
                }
              }
            },
            state: {
              type: 'text',
              analyzer: 'standard',
              fields: {
                keyword: { type: 'keyword' },
                suggest: {
                  type: 'completion'
                }
              }
            },
            country: {
              type: 'text',
              analyzer: 'standard',
              fields: {
                keyword: { type: 'keyword' },
                suggest: {
                  type: 'completion'
                }
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

      this.logger.log(`Created fresh index ${this.hotelIndex} with updated schema`);
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
      await this.client.update({
        index: this.hotelIndex,
        id: hotel.id.toString(),
        doc: hotel,
        doc_as_upsert: true
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
  async searchHotels(searchInput: any): Promise<HotelSearchResult> {
    try {
      const query: any = {
        bool: {
          must: [], // only for text search
          filter: [
            { term: { isActive: true } } // strict filtering
          ],
        },
      };

      // Full-text search across multiple fields
      if (searchInput.searchQuery) {
        // query.bool.must.push({
        //   multi_match: {
        //     query: searchInput.searchQuery,
        //     fields: [
        //       'name^3',           // Higher weight for name
        //       'city^2',           // Higher weight for city
        //       'state^2',          // Higher weight for state
        //       'country^2',        // Higher weight for country
        //       'description',
        //       'address',
        //     ],
        //     type: 'best_fields',
        //     fuzziness: 'AUTO',
        //   },
        // });

        query.bool.must.push({
          bool: {
            should: [
              {
                multi_match: {
                  query: searchInput.searchQuery,
                  fields: ['name^3', 'description', 'address'],
                  fuzziness: 'AUTO',
                },
              },
              {
                match_phrase: {
                  name: {
                    query: searchInput.searchQuery,
                    boost: 5,
                  },
                },
              },
            ],
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

  /**
   * Hotel search autocomplete using Elasticsearch completion suggester
   */
  async autocompleteHotelSearch(query: string): Promise<any[]> {
    try {
      const response = await this.client.search({
        index: this.hotelIndex,
        body: {
          suggest: {
            hotel_suggest: {
              prefix: query,
              completion: {
                field: 'name.suggest',
                size: 10,
                skip_duplicates: true,
              },
            },
            city_suggest: {
              prefix: query,
              completion: {
                field: 'city.suggest',
                size: 5,
                skip_duplicates: true,
              },
            },
          },
        },
      });

      const hotelSuggestions = Array.isArray(response.suggest.hotel_suggest[0]?.options)
        ? response.suggest.hotel_suggest[0].options
        : [];
      const citySuggestions = Array.isArray(response.suggest.city_suggest[0]?.options)
        ? response.suggest.city_suggest[0].options
        : [];

      // Combine and format suggestions
      const suggestions = [
        ...hotelSuggestions.map((option: any) => ({
          type: 'hotel',
          text: option.text,
          hotel: option._source,
          score: option._score,
        })),
        ...citySuggestions.map((option: any) => ({
          type: 'city',
          text: `${option.text} hotels`,
          city: option.text,
          hotel: option._source,
          score: option._score,
        }))
      ];

      // Sort by score and limit results
      return suggestions
        .sort((a, b) => b.score - a.score)
        .slice(0, 8);
    } catch (error) {
      this.logger.error('Failed to get autocomplete suggestions', error);
      return [];
    }
  }

  /**
   * Advanced autocomplete with multiple fields and patterns
   */
  async advancedAutocomplete(query: string): Promise<any[]> {
    try {
      const response = await this.client.search({
        index: this.hotelIndex,
        body: {
          size: 8,
          query: {
            bool: {
              should: [
                // Exact name matches
                {
                  match: {
                    'name.keyword': {
                      query: query,
                      boost: 3.0
                    }
                  }
                },
                // Partial name matches
                {
                  match_phrase_prefix: {
                    name: {
                      query: query,
                      boost: 2.0
                    }
                  }
                },
                // City matches
                {
                  match: {
                    'city.keyword': {
                      query: query,
                      boost: 1.5
                    }
                  }
                },
                // Description contains query
                {
                  match: {
                    description: {
                      query: query,
                      boost: 1.0
                    }
                  }
                },
                // Address matches
                {
                  match_phrase_prefix: {
                    address: {
                      query: query,
                      boost: 1.2
                    }
                  }
                }
              ],
              filter: [
                { term: { isActive: true } }
              ],
              minimum_should_match: 1
            }
          },
          _source: ['id', 'name', 'city', 'state', 'country', 'rating', 'address'],
          sort: [
            { _score: { order: 'desc' } },
            { rating: { order: 'desc' } }
          ]
        }
      });

      return response.hits.hits.map((hit: any) => ({
        type: 'hotel',
        text: `${hit._source.name} - ${hit._source.city}, ${hit._source.state}`,
        hotel: hit._source,
        score: hit._score,
      }));
    } catch (error) {
      this.logger.error('Failed to get advanced autocomplete suggestions', error);
      return [];
    }
  }
}
