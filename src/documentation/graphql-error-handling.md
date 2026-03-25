# GraphQL Error Handling with GraphQLError

## 🚀 **Native GraphQL Error Handling**

All services now use **native `GraphQLError`** instead of NestJS exceptions, following GraphQL best practices for error handling and providing better client-side error information.

## 📋 **GraphQL Error Structure**

### **Standard GraphQL Error Format**
```json
{
  "errors": [
    {
      "message": "User name is required",
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "path": ["createUser"],
      "extensions": {
        "code": "BAD_REQUEST",
        "field": "name",
        "timestamp": "2024-03-19T16:30:00.000Z"
      }
    }
  ],
  "data": null
}
```

### **Error Codes Used**
- **`BAD_REQUEST`**: Input validation errors (400)
- **`NOT_FOUND`**: Resource not found (404)
- **`CONFLICT`**: Resource conflicts (409)
- **`INTERNAL_SERVER_ERROR`**: Server errors (500)
- **`FORBIDDEN`**: Authorization errors (403)
- **`UNAUTHORIZED`**: Authentication errors (401)

## 🔧 **GraphQLError Implementation**

### **User Service Example**
```typescript
import { GraphQLError } from 'graphql';

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
```

### **Hotel Service Example**
```typescript
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
    
    throw new GraphQLError('Failed to retrieve hotels from database', {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR'
      }
    });
  }
}
```

### **Booking Service Example**
```typescript
async create(createBookingDto: CreateBookingInput): Promise<Booking> {
  try {
    // Validate dates
    const checkInDate = new Date(createBookingDto.checkIn);
    const checkOutDate = new Date(createBookingDto.checkOut);
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
    
    throw new GraphQLError('Failed to create booking', {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR'
      }
    });
  }
}
```

## 🎯 **GraphQL Exception Filter**

### **Updated Filter**
```typescript
import { GraphQLError } from 'graphql';

@Catch()
export class GraphQLExceptionFilter implements GqlExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    
    // If it's already a GraphQLError, just log and return it
    if (exception instanceof GraphQLError) {
      this.logger.error(
        `GraphQL Error: ${exception.message}`,
        exception.extensions
      );
      return exception;
    }
    
    // Handle non-GraphQL errors by converting them to GraphQLError
    let message = 'Internal server error';
    let code = 'INTERNAL_SERVER_ERROR';
    
    if (exception instanceof Error) {
      message = exception.message;
      code = 'INTERNAL_SERVER_ERROR';
    }
    
    const graphQLError = new GraphQLError(message, {
      extensions: {
        code,
        timestamp: new Date().toISOString(),
        path: gqlHost.getInfo()?.fieldName || 'unknown',
      }
    });
    
    return graphQLError;
  }
}
```

## 🧪 **GraphQL Playground Testing**

### **Test Input Validation**
```graphql
# Test missing required field
mutation {
  createUser(input: {
    name: "John Doe"
    # Missing email field
  }) {
    id
    name
    email
  }
}
```

**Expected Response:**
```json
{
  "errors": [
    {
      "message": "User email is required",
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "path": ["createUser"],
      "extensions": {
        "code": "BAD_REQUEST",
        "field": "email",
        "timestamp": "2024-03-19T16:30:00.000Z"
      }
    }
  ],
  "data": null
}
```

### **Test Conflict Error**
```graphql
# Test duplicate email
mutation {
  createUser(input: {
    name: "John Doe",
    email: "existing@example.com"
  }) {
    id
    name
    email
  }
}
```

**Expected Response:**
```json
{
  "errors": [
    {
      "message": "User with this email already exists",
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "path": ["createUser"],
      "extensions": {
        "code": "CONFLICT",
        "field": "email",
        "timestamp": "2024-03-19T16:30:00.000Z"
      }
    }
  ],
  "data": null
}
```

### **Test Not Found Error**
```graphql
# Test non-existent user
query {
  user(id: 999) {
    id
    name
    email
  }
}
```

**Expected Response:**
```json
{
  "errors": [
    {
      "message": "User not found",
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "path": ["user"],
      "extensions": {
        "code": "NOT_FOUND",
        "field": "id",
        "timestamp": "2024-03-19T16:30:00.000Z"
      }
    }
  ],
  "data": null
}
```

### **Test Booking Validation**
```graphql
# Test invalid dates
mutation {
  createBooking(input: {
    userId: 1,
    hotelId: 1,
    checkIn: "2024-03-19",
    checkOut: "2024-03-18"
  }) {
    id
    userId
    hotelId
    checkIn
    checkOut
  }
}
```

**Expected Response:**
```json
{
  "errors": [
    {
      "message": "Check-out date must be after check-in date",
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "path": ["createBooking"],
      "extensions": {
        "code": "BAD_REQUEST",
        "field": "checkOut",
        "timestamp": "2024-03-19T16:30:00.000Z"
      }
    }
  ],
  "data": null
}
```

## 📋 **Error Code Reference**

| Error Code | HTTP Status | GraphQL Status | Use Case | Example |
|------------|-------------|-----------------|----------|---------|
| `BAD_REQUEST` | 400 | Bad Request | Input validation | Missing required field |
| `NOT_FOUND` | 404 | Not Found | Resource not found | User ID doesn't exist |
| `CONFLICT` | 409 | Conflict | Resource conflicts | Duplicate email |
| `INTERNAL_SERVER_ERROR` | 500 | Internal Server | Database errors | Connection failed |
| `FORBIDDEN` | 403 | Forbidden | Authorization | Insufficient permissions |
| `UNAUTHORIZED` | 401 | Unauthorized | Authentication | Invalid token |

## 🎯 **Benefits of GraphQLError**

### **✅ GraphQL Native**
- **Standard Format**: Follows GraphQL error specification
- **Better Client Support**: GraphQL clients understand these errors
- **Rich Metadata**: Extensions provide additional context

### **✅ Better Debugging**
- **Field Information**: Know which field caused the error
- **Operation Context**: Path shows the operation that failed
- **Timestamp**: When the error occurred

### **✅ Client-Friendly**
- **Structured Data**: Easy to parse and handle
- **Error Codes**: Programmatic error handling
- **Field Context**: Know exactly what went wrong

### **✅ Consistent API**
- **Uniform Format**: All errors follow the same structure
- **Predictable**: Clients can expect consistent error responses
- **Extensible**: Custom extensions for additional data

## 🚀 **Implementation Status**

### **✅ Completed Migration**
- **User Service**: All errors use GraphQLError
- **Hotel Service**: All errors use GraphQLError
- **Booking Service**: All errors use GraphQLError
- **Exception Filter**: Updated to handle GraphQLError

### **✅ Error Features**
- **Field Context**: Each error includes the field that caused it
- **Error Codes**: Standardized error codes for programmatic handling
- **Timestamp**: When the error occurred
- **Path**: GraphQL operation path

### **✅ Validation**
- **Input Validation**: All required fields checked
- **Business Logic**: Complex validation rules
- **Database Errors**: Proper error code mapping
- **Unknown Errors**: Fallback to internal server error

**All services now use native GraphQL errors with proper error codes and field context!** 🚀
