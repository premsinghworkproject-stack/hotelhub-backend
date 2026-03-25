# Booking Module Documentation

## 📋 Overview
The Booking module handles all booking-related operations including creating bookings, retrieving booking information, and managing booking relationships with users and hotels.

## 🔧 Available Operations

### 📝 Mutations

#### `createBooking`
Creates a new booking for a user at a specific hotel.

**GraphQL Query:**
```graphql
mutation CreateBooking($input: CreateBookingInput!) {
  createBooking(input: $input) {
    id
    userId
    hotelId
    checkIn
    checkOut
    createdAt
    updatedAt
    user {
      id
      name
      email
    }
    hotel {
      id
      name
      location
      price
    }
  }
}
```

**Variables:**
```json
{
  "input": {
    "userId": 1,
    "hotelId": 1,
    "checkIn": "2024-03-20",
    "checkOut": "2024-03-23"
  }
}
```

**Response:**
```json
{
  "data": {
    "createBooking": {
      "id": 1,
      "userId": 1,
      "hotelId": 1,
      "checkIn": "2024-03-20T00:00:00.000Z",
      "checkOut": "2024-03-23T00:00:00.000Z",
      "createdAt": "2024-03-19T15:30:00.000Z",
      "updatedAt": "2024-03-19T15:30:00.000Z",
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john.doe@example.com"
      },
      "hotel": {
        "id": 1,
        "name": "Grand Plaza Hotel",
        "location": "New York, NY",
        "price": 250.00
      }
    }
  }
}
```

**Validation Rules:**
- `userId`: Must be a valid user ID (integer)
- `hotelId`: Must be a valid hotel ID (integer)
- `checkIn`: Must be a valid date
- `checkOut`: Must be after checkIn date
- Business Rule: No overlapping bookings for same hotel and dates

**Error Responses:**
```json
// Invalid date range
{
  "errors": [
    {
      "message": "Check-out date must be after check-in date",
      "code": "BAD_REQUEST"
    }
  ]
}

// Hotel already booked
{
  "errors": [
    {
      "message": "Hotel is already booked for these dates",
      "code": "BAD_REQUEST"
    }
  ]
}

// User not found
{
  "errors": [
    {
      "message": "User not found",
      "code": "NOT_FOUND"
    }
  ]
}
```

---

### 🔍 Queries

#### `booking`
Retrieves a specific booking by its ID.

**GraphQL Query:**
```graphql
query GetBooking($id: Int!) {
  booking(id: $id) {
    id
    userId
    hotelId
    checkIn
    checkOut
    createdAt
    updatedAt
    user {
      id
      name
      email
    }
    hotel {
      id
      name
      location
      price
    }
  }
}
```

**Variables:**
```json
{
  "id": 1
}
```

**Response:**
```json
{
  "data": {
    "booking": {
      "id": 1,
      "userId": 1,
      "hotelId": 1,
      "checkIn": "2024-03-20T00:00:00.000Z",
      "checkOut": "2024-03-23T00:00:00.000Z",
      "createdAt": "2024-03-19T15:30:00.000Z",
      "updatedAt": "2024-03-19T15:30:00.000Z",
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john.doe@example.com"
      },
      "hotel": {
        "id": 1,
        "name": "Grand Plaza Hotel",
        "location": "New York, NY",
        "price": 250.00
      }
    }
  }
}
```

**Error Responses:**
```json
// Booking not found
{
  "errors": [
    {
      "message": "Booking not found",
      "code": "NOT_FOUND"
    }
  ]
}
```

---

#### `bookings`
Retrieves all bookings in the system with user and hotel details.

**GraphQL Query:**
```graphql
query GetAllBookings {
  bookings {
    id
    userId
    hotelId
    checkIn
    checkOut
    createdAt
    updatedAt
    user {
      id
      name
      email
    }
    hotel {
      id
      name
      location
      price
    }
  }
}
```

**Response:**
```json
{
  "data": {
    "bookings": [
      {
        "id": 1,
        "userId": 1,
        "hotelId": 1,
        "checkIn": "2024-03-20T00:00:00.000Z",
        "checkOut": "2024-03-23T00:00:00.000Z",
        "createdAt": "2024-03-19T15:30:00.000Z",
        "updatedAt": "2024-03-19T15:30:00.000Z",
        "user": {
          "id": 1,
          "name": "John Doe",
          "email": "john.doe@example.com"
        },
        "hotel": {
          "id": 1,
          "name": "Grand Plaza Hotel",
          "location": "New York, NY",
          "price": 250.00
        }
      }
    ]
  }
}
```

---

#### `bookingsByUser`
Retrieves all bookings for a specific user.

**GraphQL Query:**
```graphql
query GetBookingsByUser($userId: Int!) {
  bookingsByUser(userId: $userId) {
    id
    hotelId
    checkIn
    checkOut
    createdAt
    updatedAt
    hotel {
      id
      name
      location
      price
    }
  }
}
```

**Variables:**
```json
{
  "userId": 1
}
```

**Response:**
```json
{
  "data": {
    "bookingsByUser": [
      {
        "id": 1,
        "hotelId": 1,
        "checkIn": "2024-03-20T00:00:00.000Z",
        "checkOut": "2024-03-23T00:00:00.000Z",
        "createdAt": "2024-03-19T15:30:00.000Z",
        "updatedAt": "2024-03-19T15:30:00.000Z",
        "hotel": {
          "id": 1,
          "name": "Grand Plaza Hotel",
          "location": "New York, NY",
          "price": 250.00
        }
      }
    ]
  }
}
```

---

#### `bookingsByHotel`
Retrieves all bookings for a specific hotel.

**GraphQL Query:**
```graphql
query GetBookingsByHotel($hotelId: Int!) {
  bookingsByHotel(hotelId: $hotelId) {
    id
    userId
    checkIn
    checkOut
    createdAt
    updatedAt
    user {
      id
      name
      email
    }
  }
}
```

**Variables:**
```json
{
  "hotelId": 1
}
```

**Response:**
```json
{
  "data": {
    "bookingsByHotel": [
      {
        "id": 1,
        "userId": 1,
        "checkIn": "2024-03-20T00:00:00.000Z",
        "checkOut": "2024-03-23T00:00:00.000Z",
        "createdAt": "2024-03-19T15:30:00.000Z",
        "updatedAt": "2024-03-19T15:30:00.000Z",
        "user": {
          "id": 1,
          "name": "John Doe",
          "email": "john.doe@example.com"
        }
      }
    ]
  }
}
```

---

## 📊 Data Types

### Booking Model
```typescript
interface Booking {
  id: number;           // Auto-increment primary key
  userId: number;       // Foreign key to User
  hotelId: number;      // Foreign key to Hotel
  checkIn: Date;        // Check-in date
  checkOut: Date;       // Check-out date
  createdAt: Date;      // Creation timestamp
  updatedAt: Date;      // Update timestamp
  user?: User;          // Associated user (optional)
  hotel?: Hotel;        // Associated hotel (optional)
}
```

### CreateBookingInput
```typescript
interface CreateBookingInput {
  userId: number;    // Required: User ID
  hotelId: number;   // Required: Hotel ID
  checkIn: string;   // Required: Check-in date (ISO format)
  checkOut: string;  // Required: Check-out date (ISO format)
}
```

---

## 🔗 Relationships

### Booking ↔ User
- **Type**: Many-to-One
- **Foreign Key**: `booking.userId` → `user.id`
- **Access**: `booking.user` returns user details

### Booking ↔ Hotel
- **Type**: Many-to-One
- **Foreign Key**: `booking.hotelId` → `hotel.id`
- **Access**: `booking.hotel` returns hotel details

---

## 🚀 Usage Examples

### **Complete Booking Flow**
```graphql
# 1. Create a booking
mutation CreateBooking {
  createBooking(input: {
    userId: 1,
    hotelId: 1,
    checkIn: "2024-03-20",
    checkOut: "2024-03-23"
  }) {
    id
    user {
      name
      email
    }
    hotel {
      name
      location
    }
  }
}

# 2. Get booking details
query GetBooking {
  booking(id: 1) {
    id
    checkIn
    checkOut
    user {
      name
      email
    }
    hotel {
      name
      location
      price
    }
  }
}

# 3. Get all user bookings
query GetUserBookings {
  bookingsByUser(userId: 1) {
    id
    checkIn
    checkOut
    hotel {
      name
      location
      price
    }
  }
}
```

---

## ⚠️ Business Rules

1. **Date Validation**: Check-out must be after check-in
2. **No Overlapping**: Same hotel cannot be booked for overlapping dates
3. **User Validation**: User must exist before booking
4. **Hotel Validation**: Hotel must exist before booking

---

## 🛠️ Error Handling

| Error Type | HTTP Code | GraphQL Code | Description |
|-------------|-----------|--------------|-------------|
| Not Found | 404 | NOT_FOUND | Resource not found |
| Bad Request | 400 | BAD_REQUEST | Invalid input data |
| Validation | 400 | BAD_REQUEST | Validation failed |

---

## 📝 Testing Tips

1. **Use GraphQL Playground**: `http://localhost:3000/graphql`
2. **Check Variables**: Ensure proper JSON format
3. **Date Format**: Use ISO date format (YYYY-MM-DD)
4. **Test Edge Cases**: Invalid dates, non-existent IDs
5. **Verify Relationships**: Check user/hotel data exists
