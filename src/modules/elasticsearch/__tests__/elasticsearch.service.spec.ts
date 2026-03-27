import { Test, TestingModule } from '@nestjs/testing';
import { ElasticsearchService } from '../elasticsearch.service';

describe('ElasticsearchService', () => {
  let service: ElasticsearchService;
  let mockClient: any;

  beforeEach(async () => {
    mockClient = {
      indices: {
        exists: jest.fn().mockResolvedValue(false),
        create: jest.fn().mockResolvedValue(undefined),
        delete: jest.fn().mockResolvedValue(undefined),
      },
      update: jest.fn().mockResolvedValue(undefined),
      bulk: jest.fn().mockResolvedValue({ items: [] }),
      search: jest.fn().mockResolvedValue({
        hits: {
          hits: [],
          total: { value: 0 }
        }
      }),
      get: jest.fn().mockResolvedValue({
        _source: { id: 1, name: 'Test Hotel' }
      }),
      delete: jest.fn().mockResolvedValue(undefined),
      info: jest.fn().mockResolvedValue({}),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ElasticsearchService,
          useFactory: () => new ElasticsearchService(),
        },
      ],
    }).compile();

    service = module.get<ElasticsearchService>(ElasticsearchService);
    (service as any).client = mockClient;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Service Initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should have correct hotel index', () => {
      expect((service as any).hotelIndex).toBe('hotels');
    });
  });

  describe('isHealthy', () => {
    it('should return true when Elasticsearch is available', async () => {
      mockClient.info.mockResolvedValue({});
      
      const result = await service.isHealthy();
      
      expect(result).toBe(true);
      expect(mockClient.info).toHaveBeenCalled();
    });

    it('should return false when Elasticsearch is not available', async () => {
      mockClient.info.mockRejectedValue(new Error('Connection failed'));
      
      const result = await service.isHealthy();
      
      expect(result).toBe(false);
    });
  });

  describe('createHotelIndex', () => {
    it('should create index when it does not exist', async () => {
      mockClient.indices.exists.mockResolvedValue(false);
      
      await service.createHotelIndex();
      
      expect(mockClient.indices.exists).toHaveBeenCalledWith({
        index: 'hotels',
      });
      expect(mockClient.indices.create).toHaveBeenCalledWith({
        index: 'hotels',
        mappings: expect.any(Object),
      });
    });

    it('should drop and recreate existing index', async () => {
      mockClient.indices.exists.mockResolvedValue(true);
      
      await service.createHotelIndex();
      
      expect(mockClient.indices.delete).toHaveBeenCalledWith({
        index: 'hotels',
      });
      expect(mockClient.indices.create).toHaveBeenCalled();
    });
  });

  describe('indexHotel', () => {
    it('should index a hotel successfully', async () => {
      const hotel = { id: 1, name: 'Test Hotel' };
      
      await service.indexHotel(hotel);
      
      expect(mockClient.update).toHaveBeenCalledWith({
        index: 'hotels',
        id: '1',
        doc: hotel,
        doc_as_upsert: true
      });
    });

    it('should handle indexing errors', async () => {
      const hotel = { id: 1, name: 'Test Hotel' };
      const error = new Error('Indexing failed');
      mockClient.update.mockRejectedValue(error);
      
      await expect(service.indexHotel(hotel)).rejects.toThrow(error);
    });
  });

  describe('searchHotels', () => {
    it('should search hotels with basic query', async () => {
      const searchInput = {
        searchQuery: 'Test Hotel',
        limit: 10,
        offset: 0
      };
      
      mockClient.search.mockResolvedValue({
        hits: {
          hits: [],
          total: { value: 0 }
        }
      });
      
      await service.searchHotels(searchInput);
      
      expect(mockClient.search).toHaveBeenCalledWith({
        index: 'hotels',
        body: {
          from: 0,
          size: 10,
          query: {
            bool: {
              must: [
                {
                  bool: {
                    should: [
                      {
                        multi_match: {
                          query: 'Test Hotel',
                          fields: ['name^3', 'description', 'address'],
                          fuzziness: 'AUTO'
                        }
                      },
                      {
                        match_phrase: {
                          name: {
                            query: 'Test Hotel',
                            boost: 5
                          }
                        }
                      }
                    ]
                  }
                }
              ],
              filter: [
                { term: { isActive: true } }
              ]
            }
          },
          sort: [
            { rating: { order: 'desc' } },
            { totalReviews: { order: 'desc' } },
            { _score: { order: 'desc' } }
          ]
        }
      });
    });

    it('should search hotels with filters', async () => {
      const searchInput = {
        searchQuery: 'Test Hotel',
        city: 'New York',
        minRating: 4,
        maxPrice: 200,
        limit: 5,
        offset: 10
      };
      
      mockClient.search.mockResolvedValue({
        hits: {
          hits: [],
          total: { value: 0 }
        }
      });
      
      await service.searchHotels(searchInput);
      
      expect(mockClient.search).toHaveBeenCalledWith({
        index: 'hotels',
        body: {
          from: 10,
          size: 5,
          query: {
            bool: {
              must: [
                {
                  bool: {
                    should: [
                      {
                        multi_match: {
                          query: 'Test Hotel',
                          fields: ['name^3', 'description', 'address'],
                          fuzziness: 'AUTO'
                        }
                      },
                      {
                        match_phrase: {
                          name: {
                            query: 'Test Hotel',
                            boost: 5
                          }
                        }
                      }
                    ]
                  }
                }
              ],
              filter: [
                { term: { isActive: true } },
                { term: { 'city.keyword': 'New York' } },
                { range: { rating: { gte: 4 } } },
                { range: { minPrice: { lte: 200 } } }
              ]
            }
          },
          sort: [
            { rating: { order: 'desc' } },
            { totalReviews: { order: 'desc' } },
            { _score: { order: 'desc' } }
          ]
        }
      });
    });

    it('should handle search errors', async () => {
      const searchInput = { searchQuery: 'Test Hotel' };
      const error = new Error('Search failed');
      mockClient.search.mockRejectedValue(error);
      
      await expect(service.searchHotels(searchInput)).rejects.toThrow(error);
    });
  });

  describe('deleteHotel', () => {
    it('should delete hotel from index', async () => {
      const hotelId = 1;
      
      await service.deleteHotel(hotelId);
      
      expect(mockClient.delete).toHaveBeenCalledWith({
        index: 'hotels',
        id: '1',
      });
    });

    it('should handle delete errors', async () => {
      const hotelId = 1;
      const error = new Error('Delete failed');
      mockClient.delete.mockRejectedValue(error);
      
      await expect(service.deleteHotel(hotelId)).rejects.toThrow(error);
    });
  });

  describe('bulkIndexHotels', () => {
    it('should bulk index hotels successfully', async () => {
      const hotels = [
        { id: 1, name: 'Hotel 1' },
        { id: 2, name: 'Hotel 2' }
      ];
      
      await service.bulkIndexHotels(hotels);
      
      expect(mockClient.bulk).toHaveBeenCalledWith({
        body: expect.arrayContaining([
          { index: { _index: 'hotels', _id: '1' } },
          { id: 1, name: 'Hotel 1' },
          { index: { _index: 'hotels', _id: '2' } },
          { id: 2, name: 'Hotel 2' }
        ])
      });
    });

    it('should handle bulk index errors', async () => {
      const hotels = [{ id: 1, name: 'Hotel 1' }];
      const error = new Error('Bulk index failed');
      mockClient.bulk.mockRejectedValue(error);
      
      await expect(service.bulkIndexHotels(hotels)).rejects.toThrow(error);
    });
  });

  describe('getHotelById', () => {
    it('should get hotel by ID successfully', async () => {
      const hotelId = 1;
      const mockHotel = { id: 1, name: 'Test Hotel' };
      mockClient.get.mockResolvedValue({ _source: mockHotel });
      
      const result = await service.getHotelById(hotelId);
      
      expect(result).toEqual(mockHotel);
      expect(mockClient.get).toHaveBeenCalledWith({
        index: 'hotels',
        id: '1',
      });
    });

    it('should return null when hotel not found', async () => {
      const hotelId = 999;
      mockClient.get.mockRejectedValue(new Error('Not found'));
      
      const result = await service.getHotelById(hotelId);
      
      expect(result).toBeNull();
    });
  });

  describe('autocompleteHotelSearch', () => {
    it('should return autocomplete suggestions', async () => {
      const query = 'Test';
      const mockResponse = {
        suggest: {
          hotel_suggest: [{
            options: [
              { text: 'Test Hotel', _source: { id: 1, name: 'Test Hotel' }, _score: 1.0 }
            ]
          }],
          city_suggest: [{
            options: [
              { text: 'Test City', _source: { id: 2, name: 'Hotel 2' }, _score: 0.8 }
            ]
          }]
        }
      };
      mockClient.search.mockResolvedValue(mockResponse);
      
      const result = await service.autocompleteHotelSearch(query);
      
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        type: 'hotel',
        text: 'Test Hotel',
        hotel: { id: 1, name: 'Test Hotel' },
        score: 1.0
      });
      expect(result[1]).toEqual({
        type: 'city',
        text: 'Test City hotels',
        city: 'Test City',
        hotel: { id: 2, name: 'Hotel 2' },
        score: 0.8
      });
    });

    it('should handle autocomplete errors gracefully', async () => {
      const query = 'Test';
      mockClient.search.mockRejectedValue(new Error('Autocomplete failed'));
      
      const result = await service.autocompleteHotelSearch(query);
      
      expect(result).toEqual([]);
    });
  });

  describe('advancedAutocomplete', () => {
    it('should return advanced autocomplete suggestions', async () => {
      const query = 'Test';
      const mockResponse = {
        hits: {
          hits: [
            {
              _source: {
                id: 1,
                name: 'Test Hotel',
                city: 'Test City',
                state: 'TS',
                country: 'TC',
                rating: 4.5,
                address: 'Test Address'
              },
              _score: 1.0
            }
          ]
        }
      };
      mockClient.search.mockResolvedValue(mockResponse);
      
      const result = await service.advancedAutocomplete(query);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        type: 'hotel',
        text: 'Test Hotel - Test City, TS',
        hotel: {
          id: 1,
          name: 'Test Hotel',
          city: 'Test City',
          state: 'TS',
          country: 'TC',
          rating: 4.5,
          address: 'Test Address'
        },
        score: 1.0
      });
    });

    it('should handle advanced autocomplete errors gracefully', async () => {
      const query = 'Test';
      mockClient.search.mockRejectedValue(new Error('Advanced autocomplete failed'));
      
      const result = await service.advancedAutocomplete(query);
      
      expect(result).toEqual([]);
    });
  });
});
