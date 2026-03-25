# Room Module API Documentation

## 📚 Overview

The Room module provides comprehensive individual room management capabilities with full CRUD operations, status tracking, and feature management. All mutations are protected with JWT authentication and hotel ownership verification.

## 🔐 Authentication

All mutations require JWT authentication. Include `Authorization` header with your JWT token:

```
Authorization: Bearer <your-jwt-token>
```

## 📋 Available Operations

### 🏨 Queries (Public & Protected)

#### `rooms`
Get rooms by room type ID or hotel ID.

```graphql
query GetRooms($roomTypeId: Int, $hotelId: Int) {
  rooms(roomTypeId: $roomTypeId, hotelId: $hotelId) {
    id
    roomNumber
    floor
    customPrice
    description
    notes
    status
    isSmokingAllowed
    isPetFriendly
    hasMinibar
    hasSafe
    hasBalcony
    hasBathtub
    hasShower
    hasKitchenette
    hasWorkDesk
    hasTV
    hasWiFi
    hasAirConditioning
    hasHeating
    roomTypeId
    roomType {
      id
      name
      basePrice
    }
    createdAt
    updatedAt
  }
}
```

#### `room`
Get a specific room by ID.

```graphql
query GetRoom($id: Int!) {
  room(id: $id) {
    id
    roomNumber
    floor
    customPrice
    description
    notes
    status
    isSmokingAllowed
    isPetFriendly
    hasMinibar
    hasSafe
    hasBalcony
    hasBathtub
    hasShower
    hasKitchenette
    hasWorkDesk
    hasTV
    hasWiFi
    hasAirConditioning
    hasHeating
    roomTypeId
    roomType {
      id
      name
      description
      basePrice
      maxOccupancy
      adults
      children
      amenities
    }
    createdAt
    updatedAt
  }
}
```

#### `searchRooms`
Search rooms with comprehensive filtering options.

```graphql
query SearchRooms($input: SearchRoomsInput!) {
  searchRooms(input: $input) {
    id
    roomNumber
    floor
    customPrice
    description
    status
    isSmokingAllowed
    isPetFriendly
    hasMinibar
    hasSafe
    hasBalcony
    hasBathtub
    hasShower
    hasKitchenette
    hasWorkDesk
    hasTV
    hasWiFi
    hasAirConditioning
    hasHeating
    roomTypeId
    roomType {
      id
      name
      basePrice
      hotelId
    }
  }
}
```

**SearchRoomsInput Fields:**
- `roomTypeId`: Filter by room type ID
- `hotelId`: Filter by hotel ID
- `roomNumber`: Filter by room number (partial match)
- `status`: Filter by room status
- `floor`: Filter by floor (partial match)
- `minPrice`: Minimum custom price
- `maxPrice`: Maximum custom price
- `isSmokingAllowed`: Filter by smoking allowance
- `isPetFriendly`: Filter by pet-friendly status
- `hasMinibar`: Filter by minibar availability
- `hasSafe`: Filter by safe availability
- `hasBalcony`: Filter by balcony availability
- `hasBathtub`: Filter by bathtub availability
- `hasShower`: Filter by shower availability
- `hasKitchenette`: Filter by kitchenette availability
- `hasWorkDesk`: Filter by work desk availability
- `hasTV`: Filter by TV availability
- `hasWiFi`: Filter by WiFi availability
- `hasAirConditioning`: Filter by AC availability
- `hasHeating`: Filter by heating availability
- `limit`: Results limit (default: 20)
- `offset`: Results offset (default: 0)

#### `roomCount`
Get total count of rooms in the system.

```graphql
query GetRoomCount {
  roomCount
}
```

### 🔧 Mutations (All Protected)

#### `createRoom` 🔒
Create a new room.

```graphql
mutation CreateRoom($input: CreateRoomInput!, $roomTypeId: Int!) {
  createRoom(input: $input, roomTypeId: $roomTypeId) {
    id
    roomNumber
    floor
    customPrice
    description
    notes
    status
    isSmokingAllowed
    isPetFriendly
    hasMinibar
    hasSafe
    hasBalcony
    hasBathtub
    hasShower
    hasKitchenette
    hasWorkDesk
    hasTV
    hasWiFi
    hasAirConditioning
    hasHeating
    roomTypeId
    roomType {
      id
      name
      basePrice
    }
    createdAt
  }
}
```

**CreateRoomInput Fields:**
- `roomNumber`: Room number (required)
- `floor`: Floor number/level (optional)
- `customPrice`: Custom price override (optional)
- `description`: Room description (optional)
- `notes`: Additional notes (optional)
- `status`: Room status (optional, default: AVAILABLE)
- `isSmokingAllowed`: Smoking allowed (optional, default: false)
- `isPetFriendly`: Pet friendly (optional, default: false)
- `hasMinibar`: Has minibar (optional, default: false)
- `hasSafe`: Has safe (optional, default: false)
- `hasBalcony`: Has balcony (optional, default: false)
- `hasBathtub`: Has bathtub (optional, default: false)
- `hasShower`: Has shower (optional, default: false)
- `hasKitchenette`: Has kitchenette (optional, default: false)
- `hasWorkDesk`: Has work desk (optional, default: false)
- `hasTV`: Has TV (optional, default: false)
- `hasWiFi`: Has WiFi (optional, default: false)
- `hasAirConditioning`: Has AC (optional, default: false)
- `hasHeating`: Has heating (optional, default: false)

#### `updateRoom` 🔒
Update room details.

```graphql
mutation UpdateRoom($id: Int!, $input: UpdateRoomInput!, $hotelId: Int!) {
  updateRoom(id: $id, input: $input, hotelId: $hotelId) {
    id
    roomNumber
    floor
    customPrice
    description
    notes
    status
    isSmokingAllowed
    isPetFriendly
    hasMinibar
    hasSafe
    hasBalcony
    hasBathtub
    hasShower
    hasKitchenette
    hasWorkDesk
    hasTV
    hasWiFi
    hasAirConditioning
    hasHeating
    updatedAt
  }
}
```

**UpdateRoomInput Fields:** All CreateRoomInput fields are optional for partial updates.

#### `deleteRoom` 🔒
Delete a room.

```graphql
mutation DeleteRoom($id: Int!, $hotelId: Int!) {
  deleteRoom(id: $id, hotelId: $hotelId) {
    success
    message
  }
}
```

#### `updateRoomStatus` 🔒
Update room status.

```graphql
mutation UpdateRoomStatus($id: Int!, $status: String!, $hotelId: Int!) {
  updateRoomStatus(id: $id, status: $status, hotelId: $hotelId) {
    id
    roomNumber
    status
    updatedAt
  }
}
```

## 🎯 Room Status Values

### Room Status Enum
- `AVAILABLE`: Room is available for booking
- `OCCUPIED`: Room is currently occupied
- `MAINTENANCE`: Room is under maintenance
- `OUT_OF_ORDER`: Room is out of service
- `CLEANING`: Room is being cleaned

## 🏨 Room Features

### Comfort Features
- `hasMinibar`: Mini refrigerator with beverages
- `hasSafe`: Electronic in-room safe
- `hasBalcony`: Private outdoor space
- `hasWorkDesk`: Dedicated work area
- `hasTV`: Television with cable/satellite

### Bathroom Features
- `hasBathtub`: Bathtub for bathing
- `hasShower`: Shower facilities

### Kitchen Facilities
- `hasKitchenette`: Small kitchen area with basic appliances

### Climate Control
- `hasAirConditioning`: Air conditioning system
- `hasHeating`: Heating system

### Policy Features
- `isSmokingAllowed`: Smoking permitted in room
- `isPetFriendly`: Pets allowed in room

### Connectivity
- `hasWiFi`: Wireless internet access

## ⚠️ Error Handling

### Common Error Codes

#### `BAD_REQUEST`
- Invalid input data
- Missing required fields
- Invalid ID format
- Invalid room number format
- Invalid status value

#### `NOT_FOUND`
- Room not found
- Room type not found
- Hotel not found

#### `FORBIDDEN`
- Unauthorized access (not hotel owner)
- Permission denied
- Room belongs to different hotel

#### `CONFLICT`
- Room number already exists in hotel
- Business rule violation

#### `INTERNAL_SERVER_ERROR`
- Database errors
- Unexpected server errors

### Error Response Format

```json
{
  "errors": [
    {
      "message": "Room not found",
      "extensions": {
        "code": "NOT_FOUND",
        "field": "id"
      }
    }
  ]
}
```

## 🚀 Usage Examples

### Complete Room Management Flow

#### 1. Create a Room
```graphql
mutation {
  createRoom(input: {
    roomNumber: "101",
    floor: "1",
    customPrice: 150.00,
    description: "Standard room with city view",
    notes: "Quiet room away from elevator",
    status: AVAILABLE,
    isPetFriendly: true,
    hasMinibar: true,
    hasSafe: true,
    hasBalcony: true,
    hasAirConditioning: true,
    hasTV: true,
    hasWiFi: true
  }, roomTypeId: 1) {
    id
    roomNumber
    floor
    customPrice
    description
    status
    roomType {
      id
      name
      basePrice
    }
    createdAt
  }
}
```

#### 2. Search Rooms
```graphql
query {
  searchRooms(input: {
    hotelId: 1,
    status: AVAILABLE,
    minPrice: 100,
    maxPrice: 200,
    hasWiFi: true,
    hasAirConditioning: true,
    isPetFriendly: true,
    limit: 10
  }) {
    id
    roomNumber
    floor
    customPrice
    status
    isPetFriendly
    hasWiFi
    hasAirConditioning
    roomType {
      id
      name
      basePrice
    }
  }
}
```

#### 3. Update Room
```graphql
mutation {
  updateRoom(id: 1, input: {
    roomNumber: "101A",
    customPrice: 160.00,
    notes: "Updated: Added extra pillows",
    hasKitchenette: true
  }, hotelId: 1) {
    id
    roomNumber
    customPrice
    notes
    hasKitchenette
    updatedAt
  }
}
```

#### 4. Update Room Status
```graphql
mutation {
  updateRoomStatus(id: 1, status: "MAINTENANCE", hotelId: 1) {
    id
    roomNumber
    status
    updatedAt
  }
}
```

#### 5. Delete Room
```graphql
mutation {
  deleteRoom(id: 1, hotelId: 1) {
    success
    message
  }
}
```

## 🔍 Advanced Search Examples

### Feature-Based Search
```graphql
query {
  searchRooms(input: {
    hotelId: 1,
    hasWiFi: true,
    hasAirConditioning: true,
    hasMinibar: true,
    hasSafe: true,
    isPetFriendly: true,
    status: AVAILABLE,
    limit: 15
  }) {
    id
    roomNumber
    floor
    customPrice
    status
    hasWiFi
    hasAirConditioning
    hasMinibar
    hasSafe
    isPetFriendly
    roomType {
      id
      name
      basePrice
    }
  }
}
```

### Price Range Search
```graphql
query {
  searchRooms(input: {
    roomTypeId: 2,
    minPrice: 80,
    maxPrice: 150,
    status: AVAILABLE,
    limit: 20
  }) {
    id
    roomNumber
    floor
    customPrice
    status
    roomType {
      id
      name
      basePrice
    }
  }
}
```

### Room Number Search
```graphql
query {
  searchRooms(input: {
    hotelId: 1,
    roomNumber: "10",
    limit: 10
  }) {
    id
    roomNumber
    floor
    status
    roomType {
      id
      name
    }
  }
}
```

## 📊 Business Rules

### Validation Rules
- Room number must be unique per hotel
- Custom price must be positive number if provided
- All feature flags must be boolean values
- Status must be valid RoomStatus enum value
- Room number format validation (alphanumeric)

### Authorization Rules
- Only hotel owners can create, update, delete their rooms
- Users can only view rooms for their hotels
- All mutations require valid JWT token
- Hotel ownership verified through room type relationship
- Room must belong to specified hotel for operations

### Search Behavior
- Room number search is case-insensitive partial match
- Floor search is case-insensitive partial match
- Multiple filters are combined with AND logic
- Feature filters require exact boolean matches
- Price range filtering is inclusive
- Pagination limits: max 100 results per request

### Room Status Management
- Rooms default to AVAILABLE status on creation
- Status transitions should follow business logic
- MAINTENANCE and OUT_OF_ORDER rooms cannot be booked
- CLEANING status indicates temporary unavailability

## 🧪 Testing

### GraphQL Playground
Visit `http://localhost:3000/graphql` to test operations interactively.

### Sample Test Data
```graphql
# Create sample room
mutation {
  createRoom(input: {
    roomNumber: "201",
    floor: "2",
    customPrice: 120.00,
    description: "Standard double room",
    status: AVAILABLE,
    hasWiFi: true,
    hasAirConditioning: true,
    hasTV: true
  }, roomTypeId: 1) {
    id
    roomNumber
    floor
    customPrice
    status
    createdAt
  }
}
```

## 📚 Additional Resources

- [Hotel API Documentation](../hotel/documentation/README.md)
- [Room Type API Documentation](../room-type/documentation/README.md)
- [Authentication Guide](../../../common/guards/README.md)
- [Database Models](../../../database/models/README.md)

## 📋 Module Structure

```
src/modules/room/
├── room.module.ts          # Module definition
├── room.resolver.ts         # GraphQL resolvers
├── room.service.ts          # Business logic
├── room.repository.ts       # Database operations
├── dto/
│   └── room.input.ts       # Input validation DTOs
└── documentation/
    └── README.md           # This documentation
```

## 🔗 Integration Notes

### Frontend Integration
- Use `hotelId` parameter for authorization in mutations
- Room numbers are unique per hotel, validate before creation
- Room status should be managed through updateRoomStatus mutation
- Custom price overrides room type base price
- Room features are individual boolean flags for UI toggles

### Common Workflows
1. **Room Inventory**: Get rooms by hotelId for room management
2. **Room Search**: Use searchRooms with filters for booking
3. **Room Status**: Update room status for housekeeping
4. **Room Features**: Filter rooms by required amenities
5. **Room Pricing**: Use customPrice for special rates
