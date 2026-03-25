# GraphQL Exception Handling Guide

## 🛡️ Clean Architecture Exception Handling

All resolvers now have **clean exception handling** with business logic properly separated into services. This follows the best practice of keeping resolvers thin and moving all validation and error handling to the service layer.

## 📋 **Architecture Overview**

### **🎯 Resolvers (Clean & Simple)**
- **Purpose**: GraphQL schema mapping only
- **Responsibility**: Call service methods
- **Exception Handling**: None (handled by services)
- **Documentation**: GraphQL examples and descriptions

### **🔧 Services (Business Logic & Validation)**
- **Purpose**: Business logic and validation
- **Responsibility**: Input validation, database operations, error handling
- **Exception Handling**: Comprehensive with proper error types
- **Documentation**: JSDoc with exception details

## � **Exception Handling Flow**

```
GraphQL Request → Resolver → Service → Repository → Database
                      ↓           ↓           ↓
                   (Clean)   (Validation) (Data Access)
                      ↓           ↓           ↓
                No Exceptions  All Exceptions  Raw Errors
```

## 📚 **Service Layer Exception Handling**

### **🔴 BadRequestException (400)**
Used for invalid input data and validation errors.

#### **User Service**
```typescript
async create(createUserDto: CreateUserInput): Promise<User> {
  try {
    // Validate input
    if (!createUserDto.name || createUserDto.name.trim().length === 0) {
      throw new BadRequestException('User name is required');
    }
    
    if (!createUserDto.email || createUserDto.email.trim().length === 0) {
      throw new BadRequestException('User email is required');
    }
    
    // Business logic
    return this.userRepository.create(createUserDto);
  } catch (error) {
    // Handle database errors
    if (error.code === 'P2002') {
      throw new ConflictException('User with this email already exists');
    }
    
    // Re-throw known exceptions
    if (error instanceof BadRequestException || error instanceof ConflictException) {
      throw error;
    }
    
    // Handle unknown errors
    throw new InternalServerErrorException('Failed to create user');
  }
}
```

#### **Hotel Service**
```typescript
async findAll(limit: number = 10, offset: number = 0): Promise<Hotel[]> {
  try {
    // Validate pagination parameters
    if (limit < 1 || limit > 100) {
      throw new BadRequestException('Limit must be between 1 and 100');
    }
    
    if (offset < 0) {
      throw new BadRequestException('Offset must be non-negative');
    }
    
    return this.hotelRepository.findAll(limit, offset);
  } catch (error) {
    // Re-throw known exceptions
    if (error instanceof BadRequestException) {
      throw error;
    }
    
    throw new InternalServerErrorException('Failed to retrieve hotels from database');
  }
}
```

#### **Booking Service**
```typescript
async create(createBookingDto: CreateBookingInput): Promise<Booking> {
  try {
    // Validate input
    if (!createBookingDto.userId || !createBookingDto.hotelId || !createBookingDto.checkIn || !createBookingDto.checkOut) {
      throw new BadRequestException('All booking fields are required: userId, hotelId, checkIn, checkOut');
    }
    
    // Validate dates
    const checkInDate = new Date(createBookingDto.checkIn);
    const checkOutDate = new Date(createBookingDto.checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (checkInDate < today) {
      throw new BadRequestException('Check-in date cannot be in the past');
    }
    
    if (checkOutDate <= checkInDate) {
      throw new BadRequestException('Check-out date must be after check-in date');
    }
    
    // Business logic
    return this.bookingRepository.create(createBookingDto);
  } catch (error) {
    // Handle database errors
    if (error.code === 'P2002') {
      throw new ConflictException('Hotel is already booked for these dates');
    }
    
    // Re-throw known exceptions
    if (error instanceof BadRequestException || error instanceof ConflictException || error instanceof NotFoundException) {
      throw error;
    }
    
    throw new InternalServerErrorException('Failed to create booking');
  }
}
```

---

### **🟡 NotFoundException (404)**
Used when requested resources don't exist.

#### **All Services**
```typescript
async findById(id: number): Promise<User> {
  try {
    // Validate ID
    if (!id || id <= 0) {
      throw new BadRequestException('Invalid user ID provided');
    }
    
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return user;
  } catch (error) {
    // Re-throw known exceptions
    if (error instanceof BadRequestException || error instanceof NotFoundException) {
      throw error;
    }
    
    throw new InternalServerErrorException('Failed to retrieve user');
  }
}
```

---

### **🟠 ConflictException (409)**
Used when resource conflicts occur.

#### **User Service**
```typescript
if (error.code === 'P2002') {
  throw new ConflictException('User with this email already exists');
}
```

#### **Hotel Service**
```typescript
if (error.code === 'P2002') {
  throw new ConflictException('Hotel with this name and location already exists');
}
```

#### **Booking Service**
```typescript
if (error.code === 'P2002') {
  throw new ConflictException('Hotel is already booked for these dates');
}
```

---

### **🔵 InternalServerErrorException (500)**
Used for unexpected server errors.

#### **All Services**
```typescript
catch (error) {
  // Re-throw known exceptions
  if (error instanceof BadRequestException || error instanceof NotFoundException) {
    throw error;
  }
  
  // Handle unknown errors
  throw new InternalServerErrorException('Failed to retrieve data');
}
```

## 🎯 **Clean Resolver Examples**

### **User Resolver (Clean)**
```typescript
@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User, { 
    name: 'createUser',
    description: 'Create a new user with name and email'
  })
  async createUser(@Args('input') createUserDto: CreateUserInput): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Query(() => User, { 
    name: 'user',
    description: 'Get a specific user by their ID',
    nullable: true
  })
  async getUserById(@Args('id', { type: () => Int }) id: number): Promise<User | null> {
    return this.userService.findById(id);
  }

  @Query(() => [User], { 
    name: 'users',
    description: 'Get all users in the system'
  })
  async getUsers(): Promise<User[]> {
    return this.userService.findAll();
  }
}
```

### **Hotel Resolver (Clean)**
```typescript
@Resolver(() => Hotel)
export class HotelResolver {
  constructor(private readonly hotelService: HotelService) {}

  @Mutation(() => Hotel, { 
    name: 'createHotel',
    description: 'Create a new hotel with name, location, and price'
  })
  async createHotel(@Args('input') input: any): Promise<Hotel> {
    return this.hotelService.create(input);
  }

  @Query(() => Hotel, { 
    name: 'hotel',
    description: 'Get a specific hotel by its ID',
    nullable: true
  })
  async getHotelById(@Args('id', { type: () => Int }) id: number): Promise<Hotel | null> {
    return this.hotelService.findById(id);
  }

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
}
```

### **Booking Resolver (Clean)**
```typescript
@Resolver(() => Booking)
export class BookingResolver {
  constructor(private readonly bookingService: BookingService) {}

  @Mutation(() => Booking, { 
    name: 'createBooking',
    description: 'Create a new booking for a user at a specific hotel'
  })
  async createBooking(@Args('input') createBookingDto: CreateBookingInput): Promise<Booking> {
    return this.bookingService.create(createBookingDto);
  }

  @Query(() => Booking, { 
    name: 'booking',
    description: 'Get a specific booking by its ID',
    nullable: true
  })
  async getBookingById(@Args('id', { type: () => Int }) id: number): Promise<Booking | null> {
    return this.bookingService.findById(id);
  }

  @Query(() => [Booking], { 
    name: 'bookings',
    description: 'Get all bookings in the system'
  })
  async getBookings(): Promise<Booking[]> {
    return this.bookingService.findAll();
  }
}
```

## 🧪 **Testing Exception Handling**

### **GraphQL Playground Testing**
```graphql
# Test invalid user ID
query {
  user(id: -1) {
    id
    name
  }
}

# Expected Response:
{
  "errors": [
    {
      "message": "Invalid user ID provided",
      "status": 400,
      "timestamp": "2024-03-19T16:30:00.000Z",
      "path": "user"
    }
  ],
  "data": null
}
```

### **Test Invalid Booking**
```graphql
mutation {
  createBooking(input: {
    userId: 0,
    hotelId: -1,
    checkIn: "2024-03-20",
    checkOut: "2024-03-19"
  }) {
    id
  }
}

# Expected Response:
{
  "errors": [
    {
      "message": "User ID and Hotel ID must be positive numbers",
      "status": 400,
      "timestamp": "2024-03-19T16:30:00.000Z",
      "path": "createBooking"
    }
  ],
  "data": null
}
```

## � **Service Layer Exception Patterns**

### **Pattern 1: Input Validation**
```typescript
async create(createBookingDto: CreateBookingInput): Promise<Booking> {
  try {
    // Validate input
    if (!createBookingDto.userId || !createBookingDto.hotelId) {
      throw new BadRequestException('All booking fields are required');
    }
    
    // Business logic
    return await this.bookingRepository.create(createBookingDto);
  } catch (error) {
    // Handle database errors
    if (error.code === 'P2002') {
      throw new ConflictException('Hotel is already booked for these dates');
    }
    
    // Re-throw known exceptions
    if (error instanceof BadRequestException || error instanceof ConflictException) {
      throw error;
    }
    
    // Handle unknown errors
    throw new InternalServerErrorException('Failed to create booking');
  }
}
```

### **Pattern 2: ID Validation**
```typescript
async findById(id: number): Promise<User> {
  try {
    // Validate ID
    if (!id || id <= 0) {
      throw new BadRequestException('Invalid user ID provided');
    }
    
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return user;
  } catch (error) {
    // Re-throw known exceptions
    if (error instanceof BadRequestException || error instanceof NotFoundException) {
      throw error;
    }
    
    throw new InternalServerErrorException('Failed to retrieve user');
  }
}
```

### **Pattern 3: Search Validation**
```typescript
async searchByName(name: string): Promise<Hotel[]> {
  try {
    // Validate search term
    if (!name || name.trim().length === 0) {
      throw new BadRequestException('Search name cannot be empty');
    }
    
    if (name.length < 2) {
      throw new BadRequestException('Search name must be at least 2 characters long');
    }
    
    return await this.hotelService.searchByName(name.trim());
  } catch (error) {
    // Re-throw known exceptions
    if (error instanceof BadRequestException) {
      throw error;
    }
    
    throw new InternalServerErrorException('Failed to search hotels');
  }
}
```

## 📋 **Error Code Reference**

| Error Code | HTTP Status | GraphQL Status | Use Case |
|------------|-------------|-----------------|----------|
| `P2002` | 409 | Conflict | Unique constraint violation |
| `P2025` | 404 | Not Found | Record not found |
| Custom | 400 | Bad Request | Input validation |
| Custom | 500 | Internal Server | Database errors |

## 🎯 **Benefits of Clean Architecture**

### **✅ Separation of Concerns**
- **Resolvers**: GraphQL schema mapping only
- **Services**: Business logic and validation
- **Repositories**: Data access only

### **✅ Maintainability**
- **Single Responsibility**: Each layer has one purpose
- **Testability**: Services can be unit tested independently
- **Reusability**: Business logic can be reused across different interfaces

### **✅ Error Handling**
- **Centralized**: All validation in one place
- **Consistent**: Same error handling patterns across all services
- **Comprehensive**: All edge cases covered

### **✅ Code Quality**
- **Clean**: Resolvers are thin and readable
- **Documented**: Services have comprehensive JSDoc
- **Type-safe**: Proper TypeScript types throughout

## 🚀 **Implementation Status**

### **✅ Completed Refactoring**
- **User Resolver**: Clean, delegates to UserService
- **Hotel Resolver**: Clean, delegates to HotelService  
- **Booking Resolver**: Clean, delegates to BookingService

### **✅ Services Enhanced**
- **User Service**: Comprehensive validation and error handling
- **Hotel Service**: Input validation and database error handling
- **Booking Service**: Complex business logic with date validation

### **✅ Exception Handling**
- **Input Validation**: All services validate inputs
- **Database Errors**: Proper error code mapping
- **Business Logic**: Comprehensive validation rules
- **Error Messages**: Clear and actionable error messages

### **✅ Documentation**
- **JSDoc Comments**: Complete documentation in services
- **GraphQL Descriptions**: Clear resolver descriptions
- **Examples**: Ready-to-use GraphQL queries
- **Error Testing**: Comprehensive test scenarios

**All resolvers now follow clean architecture with comprehensive exception handling in services!** 🛡️
