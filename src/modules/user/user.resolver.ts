import { Resolver, Mutation, Query, Args, Int } from '@nestjs/graphql';
import { User } from '../../database/models/user.model';
import { UserService } from './user.service';
import { CreateUserInput } from './dto/create-user.input';

/**
 * User Resolver - Handles all user-related GraphQL operations
 * 
 * This resolver provides CRUD operations for user management.
 * All business logic and exception handling is handled by the UserService.
 */
@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  /**
   * Create a new user in the system
   * 
   * @param createUserDto - User data including name and email
   * @returns The newly created user with all details
   * 
   * @example
   * ```graphql
   * mutation {
   *   createUser(input: {
   *     name: "John Doe",
   *     email: "john.doe@example.com"
   *   }) {
   *     id
   *     name
   *     email
   *     createdAt
   *     updatedAt
   *   }
   * }
   * ```
   */
  @Mutation(() => User, { 
    name: 'createUser',
    description: 'Create a new user with name and email'
  })
  async createUser(@Args('input') createUserDto: CreateUserInput): Promise<User> {
    return this.userService.create(createUserDto);
  }

  /**
   * Get a specific user by their ID
   * 
   * @param id - The unique identifier of the user
   * @returns The user details or null if not found
   * 
   * @example
   * ```graphql
   * query {
   *   user(id: 1) {
   *     id
   *     name
   *     email
   *     createdAt
   *     updatedAt
   *   }
   * }
   * ```
   */
  @Query(() => User, { 
    name: 'user',
    description: 'Get a specific user by their ID',
    nullable: true
  })
  async getUserById(@Args('id', { type: () => Int }) id: number): Promise<User | null> {
    return this.userService.findById(id);
  }

  /**
   * Get all users in the system
   * 
   * @returns Array of all users with their details
   * 
   * @example
   * ```graphql
   * query {
   *   users {
   *     id
   *     name
   *     email
   *     createdAt
   *     updatedAt
   *   }
   * }
   * ```
   */
  @Query(() => [User], { 
    name: 'users',
    description: 'Get all users in the system'
  })
  async getUsers(): Promise<User[]> {
    return this.userService.findAll();
  }
}
