import { Resolver, Mutation, Query, Args, Int } from '@nestjs/graphql';
import { Booking } from '../../database/models/booking.model';
import { BookingService } from './booking.service';
import { CreateBookingInput } from './dto/create-booking.input';

/**
 * Booking Resolver - Handles all booking-related GraphQL operations
 * 
 * This resolver provides CRUD operations for the booking system.
 * All business logic and exception handling is handled by the BookingService.
 */
@Resolver(() => Booking)
export class BookingResolver {
  constructor(private readonly bookingService: BookingService) {}

  /**
   * Create a new booking
   * 
   * @param createBookingDto - Booking data including userId, hotelId, checkIn, and checkOut dates
   * @returns The newly created booking with all details
   * 
   * @example
   * ```graphql
   * mutation {
   *   createBooking(input: {
   *     userId: 1,
   *     hotelId: 1,
   *     checkIn: "2024-03-20",
   *     checkOut: "2024-03-23"
   *   }) {
   *     id
   *     userId
   *     hotelId
   *     checkIn
   *     checkOut
   *     user {
   *       id
   *       name
   *       email
   *     }
   *     hotel {
   *       id
   *       name
   *       location
   *       price
   *     }
   *   }
   * }
   * ```
   */
  @Mutation(() => Booking, { 
    name: 'createBooking',
    description: 'Create a new booking for a user at a specific hotel'
  })
  async createBooking(@Args('input') createBookingDto: CreateBookingInput): Promise<Booking> {
    return this.bookingService.create(createBookingDto);
  }

  /**
   * Get a specific booking by its ID
   * 
   * @param id - The unique identifier of the booking
   * @returns The booking details including user and hotel information
   * 
   * @example
   * ```graphql
   * query {
   *   booking(id: 1) {
   *     id
   *     userId
   *     hotelId
   *     checkIn
   *     checkOut
   *     user {
   *       name
   *       email
   *     }
   *     hotel {
   *       name
   *       location
   *       price
   *     }
   *   }
   * }
   * ```
   */
  @Query(() => Booking, { 
    name: 'booking',
    description: 'Get a specific booking by its ID',
    nullable: true
  })
  async getBookingById(@Args('id', { type: () => Int }) id: number): Promise<Booking | null> {
    return this.bookingService.findById(id);
  }

  /**
   * Get all bookings in the system
   * 
   * @returns Array of all bookings with user and hotel details
   * 
   * @example
   * ```graphql
   * query {
   *   bookings {
   *     id
   *     userId
   *     hotelId
   *     checkIn
   *     checkOut
   *     user {
   *       name
   *       email
   *     }
   *     hotel {
   *       name
   *       location
   *       price
   *     }
   *   }
   * }
   * ```
   */
  @Query(() => [Booking], { 
    name: 'bookings',
    description: 'Get all bookings in the system'
  })
  async getBookings(): Promise<Booking[]> {
    return this.bookingService.findAll();
  }

  /**
   * Get all bookings for a specific user
   * 
   * @param userId - The unique identifier of the user
   * @returns Array of bookings belonging to the specified user
   * 
   * @example
   * ```graphql
   * query {
   *   bookingsByUser(userId: 1) {
   *     id
   *     hotelId
   *     checkIn
   *     checkOut
   *     hotel {
   *       name
   *       location
   *       price
   *     }
   *   }
   * }
   * ```
   */
  @Query(() => [Booking], { 
    name: 'bookingsByUser',
    description: 'Get all bookings for a specific user'
  })
  async getBookingsByUser(@Args('userId', { type: () => Int }) userId: number): Promise<Booking[]> {
    return this.bookingService.findByUserId(userId);
  }

  /**
   * Get all bookings for a specific hotel
   * 
   * @param hotelId - The unique identifier of the hotel
   * @returns Array of bookings for the specified hotel
   * 
   * @example
   * ```graphql
   * query {
   *   bookingsByHotel(hotelId: 1) {
   *     id
   *     userId
   *     checkIn
   *     checkOut
   *     user {
   *       name
   *       email
   *     }
   *   }
   * }
   * ```
   */
  @Query(() => [Booking], { 
    name: 'bookingsByHotel',
    description: 'Get all bookings for a specific hotel'
  })
  async getBookingsByHotel(@Args('hotelId', { type: () => Int }) hotelId: number): Promise<Booking[]> {
    return this.bookingService.findByHotelId(hotelId);
  }
}
