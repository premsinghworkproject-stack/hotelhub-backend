import { Injectable } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { Booking } from '../../database/models/booking.model';
import { BookingRepository } from './booking.repository';
import { CreateBookingInput } from './dto/create-booking.input';
import { UserService } from '../user/user.service';
import { HotelService } from '../hotel/hotel.service';

/**
 * Booking Service - Handles all booking business logic and GraphQL error handling
 * 
 * This service manages booking operations including validation, database operations,
 * and comprehensive GraphQL error handling for all booking-related functionality.
 */
@Injectable()
export class BookingService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly userService: UserService,
    private readonly hotelService: HotelService,
  ) {}

  /**
   * Create a new booking
   * 
   * @param createBookingDto - Booking data including userId, hotelId, checkIn, and checkOut dates
   * @returns The newly created booking with all details
   * 
   * @throws GraphQLError - If input validation fails or booking conflicts
   */
  async create(createBookingDto: CreateBookingInput): Promise<Booking> {
    try {
      const { userId, hotelId, checkIn, checkOut } = createBookingDto;

      // Validate input
      if (!userId || !hotelId || !checkIn || !checkOut) {
        throw new GraphQLError('All booking fields are required: userId, hotelId, checkIn, checkOut', {
          extensions: {
            code: 'BAD_REQUEST'
          }
        });
      }

      if (userId <= 0 || hotelId <= 0) {
        throw new GraphQLError('User ID and Hotel ID must be positive numbers', {
          extensions: {
            code: 'BAD_REQUEST',
            field: 'userId'
          }
        });
      }

      // Validate dates
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (checkInDate < today) {
        throw new GraphQLError('Check-in date cannot be in the past', {
          extensions: {
            code: 'BAD_REQUEST',
            field: 'checkIn'
          }
        });
      }

      if (checkOutDate <= checkInDate) {
        throw new GraphQLError('Check-out date must be after check-in date', {
          extensions: {
            code: 'BAD_REQUEST',
            field: 'checkOut'
          }
        });
      }

      const nightsDiff = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
      if (nightsDiff > 30) {
        throw new GraphQLError('Bookings cannot exceed 30 nights', {
          extensions: {
            code: 'BAD_REQUEST',
            field: 'checkOut'
          }
        });
      }

      // Validate user and hotel exist
      const user = await this.userService.findById(userId);
      const hotel = await this.hotelService.findById(hotelId);

      // Check for overlapping bookings
      const overlappingBookings = await this.bookingRepository.findOverlappingBookings(
        hotelId,
        checkInDate,
        checkOutDate,
      );

      if (overlappingBookings.length > 0) {
        throw new GraphQLError('Hotel is already booked for these dates', {
          extensions: {
            code: 'CONFLICT',
            field: 'dates'
          }
        });
      }

      return this.bookingRepository.create(createBookingDto);
    } catch (error) {
      // Re-throw GraphQL errors
      if (error instanceof GraphQLError) {
        throw error;
      }

      // Handle database errors
      if (error.code === 'P2002') {
        throw new GraphQLError('Hotel is already booked for these dates', {
          extensions: {
            code: 'CONFLICT',
            field: 'dates'
          }
        });
      }
      
      if (error.code === 'P2025') {
        throw new GraphQLError('User or hotel not found', {
          extensions: {
            code: 'NOT_FOUND'
          }
        });
      }

      // Handle unknown errors
      throw new GraphQLError('Failed to create booking', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  }

  /**
   * Get a specific booking by its ID
   * 
   * @param id - The unique identifier of the booking
   * @returns The booking details
   * 
   * @throws GraphQLError - If ID is invalid or booking is not found
   */
  async findById(id: number): Promise<Booking> {
    try {
      // Validate ID
      if (!id || id <= 0) {
        throw new GraphQLError('Invalid booking ID provided', {
          extensions: {
            code: 'BAD_REQUEST',
            field: 'id'
          }
        });
      }

      const booking = await this.bookingRepository.findById(id);
      if (!booking) {
        throw new GraphQLError('Booking not found', {
          extensions: {
            code: 'NOT_FOUND',
            field: 'id'
          }
        });
      }
      return booking;
    } catch (error) {
      // Re-throw GraphQL errors
      if (error instanceof GraphQLError) {
        throw error;
      }

      // Handle unknown errors
      throw new GraphQLError('Failed to retrieve booking', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  }

  /**
   * Get all bookings in the system
   * 
   * @returns Array of all bookings with user and hotel details
   * 
   * @throws GraphQLError - If database operation fails
   */
  async findAll(): Promise<Booking[]> {
    try {
      return await this.bookingRepository.findAll();
    } catch (error) {
      throw new GraphQLError('Failed to retrieve bookings from database', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  }

  /**
   * Get all bookings for a specific user
   * 
   * @param userId - The unique identifier of the user
   * @returns Array of bookings belonging to the specified user
   * 
   * @throws GraphQLError - If user ID is invalid or user is not found
   */
  async findByUserId(userId: number): Promise<Booking[]> {
    try {
      // Validate user ID
      if (!userId || userId <= 0) {
        throw new GraphQLError('Invalid user ID provided', {
          extensions: {
            code: 'BAD_REQUEST',
            field: 'userId'
          }
        });
      }

      // Verify user exists
      await this.userService.findById(userId);
      
      return await this.bookingRepository.findByUserId(userId);
    } catch (error) {
      // Re-throw GraphQL errors
      if (error instanceof GraphQLError) {
        throw error;
      }

      // Handle unknown errors
      throw new GraphQLError('Failed to retrieve user bookings', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  }

  /**
   * Get all bookings for a specific hotel
   * 
   * @param hotelId - The unique identifier of the hotel
   * @returns Array of bookings for the specified hotel
   * 
   * @throws GraphQLError - If hotel ID is invalid or hotel is not found
   */
  async findByHotelId(hotelId: number): Promise<Booking[]> {
    try {
      // Validate hotel ID
      if (!hotelId || hotelId <= 0) {
        throw new GraphQLError('Invalid hotel ID provided', {
          extensions: {
            code: 'BAD_REQUEST',
            field: 'hotelId'
          }
        });
      }

      // Verify hotel exists
      await this.hotelService.findById(hotelId);
      
      return await this.bookingRepository.findByHotelId(hotelId);
    } catch (error) {
      // Re-throw GraphQL errors
      if (error instanceof GraphQLError) {
        throw error;
      }

      // Handle unknown errors
      throw new GraphQLError('Failed to retrieve hotel bookings', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  }
}
