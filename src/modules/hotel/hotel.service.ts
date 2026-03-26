import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { Hotel } from '../../database/models/hotel.model';
import { HotelRepository } from './hotel.repository';
import { CreateHotelInput, UpdateHotelInput, SearchHotelsInput } from './dto/hotel.input';

/**
 * Hotel Service - Handles all hotel business logic and GraphQL error handling
 * 
 * This service manages hotel operations including validation, database operations,
 * and comprehensive GraphQL error handling for all hotel-related functionality.
 */
@Injectable()
export class HotelService {
  constructor(private readonly hotelRepository: HotelRepository) {}

  /**
   * Create a new hotel
   * 
   * @param createHotelInput - Hotel data
   * @param ownerId - Hotel owner ID
   * @returns Created hotel
   * 
   * @throws GraphQLError - If creation fails
   */
  async create(createHotelInput: CreateHotelInput, ownerId: number): Promise<Hotel> {
    try {
      // Validate input
      if (!createHotelInput.name || createHotelInput.name.trim().length === 0) {
        throw new GraphQLError('Hotel name is required', {
          extensions: {
            code: 'BAD_REQUEST',
            field: 'name'
          }
        });
      }

      if (!createHotelInput.address || createHotelInput.address.trim().length === 0) {
        throw new GraphQLError('Hotel address is required', {
          extensions: {
            code: 'BAD_REQUEST',
            field: 'address'
          }
        });
      }

      if (!createHotelInput.city || createHotelInput.city.trim().length === 0) {
        throw new GraphQLError('Hotel city is required', {
          extensions: {
            code: 'BAD_REQUEST',
            field: 'city'
          }
        });
      }

      const hotelData = {
        ...createHotelInput,
        name: createHotelInput.name.trim(),
        address: createHotelInput.address.trim(),
        city: createHotelInput.city.trim(),
        state: createHotelInput.state?.trim() || createHotelInput.city.trim(),
        country: createHotelInput.country?.trim() || createHotelInput.city.trim(),
        postalCode: createHotelInput.postalCode?.trim() || '',
        phone: createHotelInput.phone?.trim() || '',
        email: createHotelInput.email?.trim() || '',
        website: createHotelInput.website?.trim() || '',
        description: createHotelInput.description?.trim() || '',
        latitude: createHotelInput.latitude,
        longitude: createHotelInput.longitude,
        ownerId,
        isActive: true,
        isVerified: false,
        rating: 0,
        totalReviews: 0
      };

      return await this.hotelRepository.create(hotelData);
    } catch (error) {
      throw new GraphQLError('Failed to create hotel', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  }

  /**
   * Get a specific hotel by its ID
   * 
   * @param id - The unique identifier of the hotel
   * @returns The hotel details
   * 
   * @throws GraphQLError - If ID is invalid or hotel is not found
   */
  async findById(id: number): Promise<Hotel> {
    try {
      // Validate ID
      if (!id || id <= 0) {
        throw new GraphQLError('Invalid hotel ID provided', {
          extensions: {
            code: 'BAD_REQUEST',
            field: 'id'
          }
        });
      }
      
      const hotel = await this.hotelRepository.findById(id);
      if (!hotel) {
        throw new GraphQLError('Hotel not found', {
          extensions: {
            code: 'NOT_FOUND',
            field: 'id'
          }
        });
      }
      
      return hotel;
    } catch (error) {
      // Re-throw GraphQL errors
      if (error instanceof GraphQLError) {
        throw error;
      }
      
      // Handle unknown errors
      throw new GraphQLError('Failed to retrieve hotel', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  }

  /**
   * Get all hotels with pagination support
   * 
   * @param limit - Maximum number of hotels to return (default: 10)
   * @param offset - Number of hotels to skip (default: 0)
   * @returns Array of hotels with pagination
   * 
   * @throws GraphQLError - If pagination parameters are invalid
   */
  async findAll(limit: number = 10, offset: number = 0): Promise<Hotel[]> {
    try {
      // Validate pagination parameters
      if (limit < 1 || limit > 100) {
        throw new GraphQLError('Limit must be between 1 and 100', {
          extensions: {
            code: 'BAD_REQUEST',
            field: 'limit'
          }
        });
      }
      
      if (offset < 0) {
        throw new GraphQLError('Offset must be non-negative', {
          extensions: {
            code: 'BAD_REQUEST',
            field: 'offset'
          }
        });
      }
      
      return this.hotelRepository.findAll(limit, offset);
    } catch (error) {
      // Re-throw GraphQL errors
      if (error instanceof GraphQLError) {
        throw error;
      }
      
      // Handle unknown errors
      throw new GraphQLError('Failed to retrieve hotels from database', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  }

  /**
   * Search hotels by name (case-insensitive partial match)
   * 
   * @param name - The search term for hotel name
   * @returns Array of hotels matching the search criteria
   * 
   * @throws GraphQLError - If search term is empty or invalid
   */
  async searchByName(name: string): Promise<Hotel[]> {
    try {
      // Validate search term
      if (!name || name.trim().length === 0) {
        throw new GraphQLError('Search name cannot be empty', {
          extensions: {
            code: 'BAD_REQUEST',
            field: 'name'
          }
        });
      }
      
      if (name.length < 2) {
        throw new GraphQLError('Search name must be at least 2 characters long', {
          extensions: {
            code: 'BAD_REQUEST',
            field: 'name'
          }
        });
      }
      
      if (name.length > 100) {
        throw new GraphQLError('Search name is too long (max 100 characters)', {
          extensions: {
            code: 'BAD_REQUEST',
            field: 'name'
          }
        });
      }
      
      return this.hotelRepository.searchByName(name.trim());
    } catch (error) {
      // Re-throw GraphQL errors
      if (error instanceof GraphQLError) {
        throw error;
      }
      
      // Handle unknown errors
      throw new GraphQLError('Failed to search hotels', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  }

  /**
   * Get hotels by owner ID
   * 
   * @param ownerId - Owner ID
   * @param limit - Maximum number of hotels to return
   * @param offset - Number of hotels to skip
   * @returns Array of hotels
   */
  async findByOwnerId(ownerId: number, limit: number = 10, offset: number = 0): Promise<Hotel[]> {
    try {
      // Validate owner ID
      if (!ownerId || ownerId <= 0) {
        throw new GraphQLError('Invalid owner ID provided', {
          extensions: {
            code: 'BAD_REQUEST',
            field: 'ownerId'
          }
        });
      }
      
      return await this.hotelRepository.findByOwnerId(ownerId, limit, offset);
    } catch (error) {
      // Re-throw GraphQL errors
      if (error instanceof GraphQLError) {
        throw error;
      }
      
      // Handle unknown errors
      throw new GraphQLError('Failed to retrieve hotels by owner', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  }

  /**
   * Search hotels with Elasticsearch integration
   * 
   * @param searchInput - Search criteria
   * @returns Array of matching hotels
   */
  async search(searchInput: SearchHotelsInput): Promise<Hotel[]> {
    try {
      // Validate search input - make it optional
      if (!searchInput) {
        // If no search input provided, return all active hotels with pagination
        return await this.hotelRepository.search({});
      }

      // Use Elasticsearch for text searches, fall back to SQL for simple queries
      const shouldUseElasticsearch = this.shouldUseElasticsearch(searchInput);
      
      if (shouldUseElasticsearch) {
        return await this.hotelRepository.searchWithElasticsearch(searchInput);
      } else {
        return await this.hotelRepository.search(searchInput);
      }
    } catch (error) {
      console.log(error);
      // Re-throw GraphQL errors
      if (error instanceof GraphQLError) {
        throw error;
      }
      
      // Handle unknown errors
      throw new GraphQLError('Failed to search hotels', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  }

  /**
   * Determine if Elasticsearch should be used for search
   * 
   * @param searchInput - Search criteria
   * @returns boolean indicating whether to use Elasticsearch
   */
  private shouldUseElasticsearch(searchInput: SearchHotelsInput): boolean {
    // Use Elasticsearch for text searches or complex queries
    return !!(
      searchInput.searchQuery ||           // Text search
      searchInput.amenities?.length ||    // Multiple amenities
      (searchInput.minRating !== undefined && searchInput.maxRating !== undefined) || // Rating range
      (searchInput.minPrice !== undefined && searchInput.maxPrice !== undefined)     // Price range
    );
  }

  /**
   * Update hotel details
   * 
   * @param id - Hotel ID
   * @param updateData - Update data
   * @param ownerId - Owner ID for authorization
   * @returns Updated hotel
   */
  async update(id: number, updateData: UpdateHotelInput, ownerId: number): Promise<Hotel> {
    try {
      // Validate ID
      if (!id || id <= 0) {
        throw new GraphQLError('Invalid hotel ID provided', {
          extensions: {
            code: 'BAD_REQUEST',
            field: 'id'
          }
        });
      }
      
      // Validate owner ID
      if (!ownerId || ownerId <= 0) {
        throw new GraphQLError('Invalid owner ID provided', {
          extensions: {
            code: 'BAD_REQUEST',
            field: 'ownerId'
          }
        });
      }
      
      // Validate update data
      if (!updateData) {
        throw new GraphQLError('Update data is required', {
          extensions: {
            code: 'BAD_REQUEST'
          }
        });
      }
      
      // Check if hotel exists and belongs to owner
      const existingHotel = await this.hotelRepository.findById(id);
      if (!existingHotel) {
        throw new GraphQLError('Hotel not found', {
          extensions: {
            code: 'NOT_FOUND'
          }
        });
      }

      if (existingHotel.ownerId !== ownerId) {
        throw new GraphQLError('You can only update your own hotels', {
          extensions: {
            code: 'FORBIDDEN'
          }
        });
      }
      
      return await this.hotelRepository.update(id, updateData);
    } catch (error) {
      // Re-throw GraphQL errors
      if (error instanceof GraphQLError) {
        throw error;
      }
      
      // Handle unknown errors
      throw new GraphQLError('Failed to update hotel', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  }

  /**
   * Delete hotel
   * 
   * @param id - Hotel ID
   * @param ownerId - Owner ID for authorization
   * @returns Success message
   */
  async delete(id: number, ownerId: number): Promise<{ success: boolean; message: string }> {
    try {
      // Validate ID
      if (!id || id <= 0) {
        throw new GraphQLError('Invalid hotel ID provided', {
          extensions: {
            code: 'BAD_REQUEST',
            field: 'id'
          }
        });
      }
      
      // Validate owner ID
      if (!ownerId || ownerId <= 0) {
        throw new GraphQLError('Invalid owner ID provided', {
          extensions: {
            code: 'BAD_REQUEST',
            field: 'ownerId'
          }
        });
      }
      
      // Check if hotel exists and belongs to owner
      const existingHotel = await this.hotelRepository.findById(id);
      if (!existingHotel) {
        throw new GraphQLError('Hotel not found', {
          extensions: {
            code: 'NOT_FOUND'
          }
        });
      }

      if (existingHotel.ownerId !== ownerId) {
        throw new GraphQLError('You can only delete your own hotels', {
          extensions: {
            code: 'FORBIDDEN'
          }
        });
      }
      
      await this.hotelRepository.delete(id);
      return {
        success: true,
        message: 'Hotel deleted successfully'
      };
    } catch (error) {
      // Re-throw GraphQL errors
      if (error instanceof GraphQLError) {
        throw error;
      }
      
      // Handle unknown errors
      throw new GraphQLError('Failed to delete hotel', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  }

  /**
   * Toggle hotel active status
   * 
   * @param id - Hotel ID
   * @param isActive - Active status
   * @param ownerId - Owner ID for authorization
   * @returns Updated hotel
   */
  async toggleActiveStatus(id: number, isActive: boolean, ownerId: number): Promise<Hotel> {
    try {
      // Validate ID
      if (!id || id <= 0) {
        throw new GraphQLError('Invalid hotel ID provided', {
          extensions: {
            code: 'BAD_REQUEST',
            field: 'id'
          }
        });
      }
      
      // Validate owner ID
      if (!ownerId || ownerId <= 0) {
        throw new GraphQLError('Invalid owner ID provided', {
          extensions: {
            code: 'BAD_REQUEST',
            field: 'ownerId'
          }
        });
      }
      
      // Check if hotel exists and belongs to owner
      const existingHotel = await this.hotelRepository.findById(id);
      if (!existingHotel) {
        throw new GraphQLError('Hotel not found', {
          extensions: {
            code: 'NOT_FOUND'
          }
        });
      }

      if (existingHotel.ownerId !== ownerId) {
        throw new GraphQLError('You can only modify your own hotels', {
          extensions: {
            code: 'FORBIDDEN'
          }
        });
      }
      
      await this.hotelRepository.toggleActiveStatus(id, isActive);
      return await this.hotelRepository.findById(id);
    } catch (error) {
      // Re-throw GraphQL errors
      if (error instanceof GraphQLError) {
        throw error;
      }
      
      // Handle unknown errors
      throw new GraphQLError('Failed to toggle hotel status', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  }

  /**
   * Get the total count of hotels
   * 
   * @returns The total number of hotels in the system
   * 
   * @throws GraphQLError - If database operation fails
   */
  async count(): Promise<number> {
    try {
      return await this.hotelRepository.count();
    } catch (error) {
      throw new GraphQLError('Failed to count hotels', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  }

  /**
   * Find hotels near a location (geospatial search)
   * 
   * @param latitude - Latitude
   * @param longitude - Longitude
   * @param radiusKm - Search radius in kilometers
   * @returns Array of nearby hotels
   */
  async findNearby(latitude: number, longitude: number, radiusKm: number = 10): Promise<Hotel[]> {
    try {
      return await this.hotelRepository.findNearby(latitude, longitude, radiusKm);
    } catch (error) {
      throw new GraphQLError('Failed to search nearby hotels', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  }
}
