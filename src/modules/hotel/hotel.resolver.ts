import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { Hotel } from '../../database/models/hotel.model';
import { HotelService } from './hotel.service';
import { CreateHotelInput } from './dto/create-hotel.input';

/**
 * Hotel Resolver - Handles all hotel-related GraphQL operations
 * 
 * This resolver provides CRUD operations for hotel management.
 * All business logic and exception handling is handled by the HotelService.
 */
@Resolver(() => Hotel)
export class HotelResolver {
  constructor(private readonly hotelService: HotelService) {}

  /**
   * Create a new hotel in the system
   * 
   * @param input - Hotel data including name, location, and price
   * @returns The newly created hotel with all details
   * 
   * @example
   * ```graphql
   * mutation {
   *   createHotel(input: {
   *     name: "Grand Plaza Hotel",
   *     location: "New York, NY",
   *     price: 250.00
   *   }) {
   *     id
   *     name
   *     location
   *     price
   *     createdAt
   *     updatedAt
   *   }
   * }
   * ```
   */
  @Mutation(() => Hotel, { 
    name: 'createHotel',
    description: 'Create a new hotel with name, location, and price'
  })
  async createHotel(@Args('input') input: CreateHotelInput): Promise<Hotel> {
    return this.hotelService.create(input);
  }

  /**
   * Get a specific hotel by its ID
   * 
   * @param id - The unique identifier of the hotel
   * @returns The hotel details or null if not found
   * 
   * @example
   * ```graphql
   * query {
   *   hotel(id: 1) {
   *     id
   *     name
   *     location
   *     price
   *     createdAt
   *     updatedAt
   *   }
   * }
   * ```
   */
  @Query(() => Hotel, { 
    name: 'hotel',
    description: 'Get a specific hotel by its ID',
    nullable: true
  })
  async getHotelById(@Args('id', { type: () => Int }) id: number): Promise<Hotel | null> {
    return this.hotelService.findById(id);
  }

  /**
   * Get all hotels with pagination support
   * 
   * @param limit - Maximum number of hotels to return (default: 10)
   * @param offset - Number of hotels to skip (default: 0)
   * @returns Array of hotels with pagination
   * 
   * @example
   * ```graphql
   * query {
   *   hotels(limit: 10, offset: 0) {
   *     id
   *     name
   *     location
   *     price
   *     createdAt
   *     updatedAt
   *   }
   * }
   * ```
   */
  @Query(() => [Hotel], { 
    name: 'hotels',
    description: 'Get all hotels with pagination support'
  })
  async getHotels(
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 }) limit: number,
    @Args('offset', { type: () => Int, nullable: true, defaultValue: 0 }) offset: number,
  ): Promise<Hotel[]> {
    return this.hotelService.findAll(limit, offset);
  }

  /**
   * Search hotels by name (case-insensitive partial match)
   * 
   * @param name - The search term for hotel name
   * @returns Array of hotels matching the search criteria
   * 
   * @example
   * ```graphql
   * query {
   *   searchHotels(name: "plaza") {
   *     id
   *     name
   *     location
   *     price
   *     createdAt
   *     updatedAt
   *   }
   * }
   * ```
   */
  @Query(() => [Hotel], { 
    name: 'searchHotels',
    description: 'Search hotels by name (case-insensitive partial match)'
  })
  async searchHotels(@Args('name') name: string): Promise<Hotel[]> {
    return this.hotelService.searchByName(name);
  }
}
