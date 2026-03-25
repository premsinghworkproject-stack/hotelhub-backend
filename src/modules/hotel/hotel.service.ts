import { Injectable } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { Hotel } from '../../database/models/hotel.model';
import { HotelRepository } from './hotel.repository';

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
   * Create a new hotel in the system
   * 
   * @param createHotelDto - Hotel data including name, location, and price
   * @returns The newly created hotel with all details
   * 
   * @throws GraphQLError - If input validation fails or hotel already exists
   */
  async create(createHotelDto: Partial<Hotel>): Promise<Hotel> {
    try {
      // Validate input
      if (!createHotelDto.name || createHotelDto.name.trim().length === 0) {
        throw new GraphQLError('Hotel name is required', {
          extensions: {
            code: 'BAD_REQUEST',
            field: 'name'
          }
        });
      }
      
      if (!createHotelDto.location || createHotelDto.location.trim().length === 0) {
        throw new GraphQLError('Hotel location is required', {
          extensions: {
            code: 'BAD_REQUEST',
            field: 'location'
          }
        });
      }
      
      if (!createHotelDto.price || createHotelDto.price <= 0) {
        throw new GraphQLError('Hotel price must be greater than 0', {
          extensions: {
            code: 'BAD_REQUEST',
            field: 'price'
          }
        });
      }
      
      if (createHotelDto.price > 10000) {
        throw new GraphQLError('Hotel price cannot exceed $10,000', {
          extensions: {
            code: 'BAD_REQUEST',
            field: 'price'
          }
        });
      }

      return this.hotelRepository.create(createHotelDto);
    } catch (error) {
      // Re-throw GraphQL errors
      if (error instanceof GraphQLError) {
        throw error;
      }
      
      // Handle database errors
      if (error.code === 'P2002') {
        throw new GraphQLError('Hotel with this name and location already exists', {
          extensions: {
            code: 'CONFLICT',
            field: 'name'
          }
        });
      }
      
      // Handle unknown errors
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
   * Get the total count of hotels
   * 
   * @returns The total number of hotels in the system
   * 
   * @throws GraphQLError - If database operation fails
   */
  async count(): Promise<number> {
    try {
      return this.hotelRepository.count();
    } catch (error) {
      throw new GraphQLError('Failed to count hotels', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  }
}
