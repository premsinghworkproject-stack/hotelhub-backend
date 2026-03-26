import { Injectable } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { User, UserType } from '../../database/models/user.model';
import { UserRepository } from './user.repository';
import { CreateUserInput } from './dto/create-user.input';

/**
 * User Service - Handles all user business logic and GraphQL error handling
 * 
 * This service manages user operations including validation, database operations,
 * and comprehensive GraphQL error handling for all user-related functionality.
 */
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Create a new user in the system
   * 
   * @param createUserDto - User data including name and email
   * @returns The newly created user with all details
   * 
   * @throws GraphQLError - If input validation fails or user already exists
   */
  async create(createUserDto: CreateUserInput): Promise<User> {
    try {
      // Validate input
      if (!createUserDto.name || createUserDto.name.trim().length === 0) {
        throw new GraphQLError('User name is required', {
          extensions: {
            code: 'BAD_REQUEST',
            field: 'name'
          }
        });
      }
      
      if (!createUserDto.email || createUserDto.email.trim().length === 0) {
        throw new GraphQLError('User email is required', {
          extensions: {
            code: 'BAD_REQUEST',
            field: 'email'
          }
        });
      }
      
      // Check if user already exists
      const existingUser = await this.userRepository.findByEmail(createUserDto.email);
      if (existingUser) {
        throw new GraphQLError('User with this email already exists', {
          extensions: {
            code: 'CONFLICT',
            field: 'email'
          }
        });
      }

      return this.userRepository.create(createUserDto);
    } catch (error) {
      // Re-throw GraphQL errors
      if (error instanceof GraphQLError) {
        throw error;
      }
      
      // Handle database errors
      if (error.code === 'P2002') {
        throw new GraphQLError('User with this email already exists', {
          extensions: {
            code: 'CONFLICT',
            field: 'email'
          }
        });
      }
      
      // Handle unknown errors
      throw new GraphQLError('Failed to create user', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  }

  /**
   * Get a specific user by their ID
   * 
   * @param id - The unique identifier of the user
   * @returns The user details
   * 
   * @throws GraphQLError - If ID is invalid or user is not found
   */
  async findById(id: number): Promise<User> {
    try {
      // Validate ID
      if (!id || id <= 0) {
        throw new GraphQLError('Invalid user ID provided', {
          extensions: {
            code: 'BAD_REQUEST',
            field: 'id'
          }
        });
      }
      
      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new GraphQLError('User not found', {
          extensions: {
            code: 'NOT_FOUND',
            field: 'id'
          }
        });
      }
      
      return user;
    } catch (error) {
      // Re-throw GraphQL errors
      if (error instanceof GraphQLError) {
        throw error;
      }
      
      // Handle unknown errors
      throw new GraphQLError('Failed to retrieve user', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  }

  /**
   * Find a user by email
   * 
   * @param email - The email address to search for
   * @returns The user details or null if not found
   * 
   * @throws GraphQLError - If email is invalid
   */
  async findByEmail(email: string): Promise<User | null> {
    try {
      // Validate email
      if (!email || email.trim().length === 0) {
        throw new GraphQLError('Email is required', {
          extensions: {
            code: 'BAD_REQUEST',
            field: 'email'
          }
        });
      }
      
      const user = await this.userRepository.findByEmail(email);
      return user; // Return user or null, don't throw error if not found
    } catch (error) {
      // Re-throw GraphQL errors
      if (error instanceof GraphQLError) {
        throw error;
      }
      
      // Handle unknown errors
      throw new GraphQLError('Failed to retrieve user', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  }

  /**
   * Get all users in the system
   * 
   * @returns Array of all users with their details
   * 
   * @throws GraphQLError - If database operation fails
   */
  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.findAll();
    } catch (error) {
      throw new GraphQLError('Failed to retrieve users from database', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  }

  /**
   * Mark user email as verified
   * 
   * @param email - The email address to mark as verified
   * @returns The updated user
   * 
   * @throws GraphQLError - If email is invalid or user is not found
   */
  async markEmailAsVerified(email: string): Promise<User> {
    try {
      // Validate email
      if (!email || email.trim().length === 0) {
        throw new GraphQLError('Email is required', {
          extensions: {
            code: 'BAD_REQUEST',
            field: 'email'
          }
        });
      }
      
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new GraphQLError('User not found', {
          extensions: {
            code: 'NOT_FOUND',
            field: 'email'
          }
        });
      }

      // Update user to mark email as verified
      const updatedUser = await this.userRepository.update(user.id, {
        isEmailVerified: true,
        emailVerifiedAt: new Date()
      });
      
      return updatedUser;
    } catch (error) {
      // Re-throw GraphQL errors
      if (error instanceof GraphQLError) {
        throw error;
      }
      
      // Handle unknown errors
      throw new GraphQLError('Failed to mark email as verified', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  }

  /**
   * Update user by ID
   * 
   * @param id - The user ID to update
   * @param updateData - The data to update
   * @returns The updated user
   * 
   * @throws GraphQLError - If ID is invalid or user is not found
   */
  async update(id: number, updateData: Partial<User>): Promise<User> {
    try {
      // Validate ID
      if (!id || id <= 0) {
        throw new GraphQLError('Invalid user ID provided', {
          extensions: {
            code: 'BAD_REQUEST',
            field: 'id'
          }
        });
      }
      
      const updatedUser = await this.userRepository.update(id, updateData);
      return updatedUser;
    } catch (error) {
      // Re-throw GraphQL errors
      if (error instanceof GraphQLError) {
        throw error;
      }
      
      // Handle unknown errors
      throw new GraphQLError('Failed to update user', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  }
}
