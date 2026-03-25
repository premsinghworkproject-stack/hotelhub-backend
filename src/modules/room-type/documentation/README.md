# Room Type Module API Documentation

## 📚 Overview

The Room Type module provides comprehensive room type management capabilities with full CRUD operations, pricing management, and occupancy configuration. All mutations are protected with JWT authentication.

## 🔐 Authentication

All mutations require JWT authentication. Include `Authorization` header with your JWT token:

```
Authorization: Bearer <your-jwt-token>
```

## 📋 Available Operations

### 🏨 Queries (Public & Protected)

#### `roomTypes`
Get room types by hotel ID or all room types.

```graphql
query GetRoomTypes($hotelId: Int) {
  roomTypes(hotelId: $hotelId) {
    id
    name
    description
    basePrice
    maxOccupancy
    adults
    children
    amenities
    isActive
    hotelId
    createdAt
    updatedAt
  }
}
```

#### `roomType`
Get a specific room type by ID.

```graphql
query GetRoomType($id: Int!) {
  roomType(id: $id) {
    id
    name
    description
    basePrice
    maxOccupancy
    adults
    children
    amenities
    isActive
    hotelId
    createdAt
    updatedAt
  }
}
```

#### `searchRoomTypes`
Search room types with multiple filters.

```graphql
query SearchRoomTypes($input: SearchRoomTypesInput!) {
  searchRoomTypes(input: $input) {
    id
    name
    description
    basePrice
    maxOccupancy
    adults
    children
    amenities
    isActive
    hotelId
  }
}
```

**SearchRoomTypesInput Fields:**
- `hotelId`: Filter by hotel ID
- `name`: Filter by room type name (partial match)
- `minPrice`: Minimum base price
- `maxPrice`: Maximum base price
- `maxOccupancy`: Maximum occupancy filter
- `adults`: Minimum adult capacity
- `children`: Minimum children capacity
- `amenities`: Array of required amenities
- `isActive`: Filter by active status
- `limit`: Results limit (default: 20)
- `offset`: Results offset (default: 0)

#### `roomTypeCount`
Get total count of room types in the system.

```graphql
query GetRoomTypeCount {
  roomTypeCount
}
```

### 🔧 Mutations (All Protected)

#### `createRoomType` 🔒
Create a new room type.

```graphql
mutation CreateRoomType($input: CreateRoomTypeInput!) {
  createRoomType(input: $input) {
    id
    name
    description
    basePrice
    maxOccupancy
    adults
    children
    amenities
    isActive
    hotelId
    createdAt
  }
}
```

**CreateRoomTypeInput Fields:**
- `name`: Room type name (required)
- `description`: Room type description (optional)
- `basePrice`: Base price per night (required)
- `maxOccupancy`: Maximum occupancy (required)
- `adults`: Maximum adult capacity (required)
- `children`: Maximum children capacity (required)
- `amenities`: Array of amenities (optional)
- `isActive`: Active status (optional, default: true)

#### `updateRoomType` 🔒
Update room type details.

```graphql
mutation UpdateRoomType($id: Int!, $input: UpdateRoomTypeInput!) {
  updateRoomType(id: $id, input: $input) {
    id
    name
    description
    basePrice
    maxOccupancy
    adults
    children
    amenities
    isActive
    updatedAt
  }
}
```

**UpdateRoomTypeInput Fields:** All CreateRoomTypeInput fields are optional for partial updates.

#### `deleteRoomType` 🔒
Delete a room type.

```graphql
mutation DeleteRoomType($id: Int!) {
  deleteRoomType(id: $id) {
    success
    message
  }
}
```

#### `toggleRoomTypeActiveStatus` 🔒
Toggle room type active status.

```graphql
mutation ToggleRoomTypeStatus($id: Int!, $isActive: Boolean!) {
  toggleRoomTypeActiveStatus(id: $id, isActive: $isActive) {
    id
    name
    isActive
    updatedAt
  }
}
```

## 🎯 Common Amenities

### Standard Amenities
- `WiFi`: Wireless internet access
- `Parking`: On-site parking
- `Pool`: Swimming pool
- `Gym`: Fitness center
- `Spa`: Spa and wellness
- `Restaurant`: On-site restaurant
- `Bar`: Hotel bar/lounge
- `RoomService`: 24/7 room service
- `Concierge`: Concierge service
- `Laundry`: Laundry service
- `AirConditioning`: Air conditioning
- `Heating`: Heating system
- `TV`: Television
- `MiniBar`: Mini refrigerator
- `Safe`: In-room safe
- `Kitchenette`: Kitchen facilities
- `Balcony`: Private balcony
- `Bathtub`: Bathtub
- `Shower`: Shower facilities
- `WorkDesk`: Work desk
- `PetFriendly`: Pet-friendly accommodation

## ⚠️ Error Handling

### Common Error Codes

#### `BAD_REQUEST`
- Invalid input data
- Missing required fields
- Invalid ID format
- Invalid price or occupancy values

#### `NOT_FOUND`
- Room type not found
- Hotel not found

#### `FORBIDDEN`
- Unauthorized access (not hotel owner)
- Permission denied

#### `CONFLICT`
- Duplicate room type name in hotel
- Business rule violation

#### `INTERNAL_SERVER_ERROR`
- Database errors
- Unexpected server errors

### Error Response Format

```json
{
  "errors": [
    {
      "message": "Room type not found",
      "extensions": {
        "code": "NOT_FOUND",
        "field": "id"
      }
    }
  ]
}
```

## 🚀 Usage Examples

### Complete Room Type Management Flow

#### 1. Create a Room Type
```graphql
mutation {
  createRoomType(input: {
    name: "Deluxe Suite",
    description: "Spacious suite with city view",
    basePrice: 250.00,
    maxOccupancy: 4,
    adults: 2,
    children: 2,
    amenities: ["WiFi", "MiniBar", "Safe", "Balcony", "AirConditioning", "TV"]
  }) {
    id
    name
    description
    basePrice
    maxOccupancy
    amenities
    createdAt
  }
}
```

#### 2. Search Room Types
```graphql
query {
  searchRoomTypes(input: {
    hotelId: 1,
    minPrice: 100,
    maxPrice: 300,
    maxOccupancy: 4,
    amenities: ["WiFi", "AirConditioning"],
    limit: 10
  }) {
    id
    name
    description
    basePrice
    maxOccupancy
    adults
    children
    amenities
    isActive
  }
}
```

#### 3. Update Room Type
```graphql
mutation {
  updateRoomType(id: 1, input: {
    name: "Deluxe Suite - Updated",
    basePrice: 275.00,
    amenities: ["WiFi", "MiniBar", "Safe", "Balcony", "AirConditioning", "TV", "WorkDesk"]
  }) {
    id
    name
    basePrice
    amenities
    updatedAt
  }
}
```

#### 4. Toggle Room Type Status
```graphql
mutation {
  toggleRoomTypeActiveStatus(id: 1, isActive: false) {
    id
    name
    isActive
    updatedAt
  }
}
```

#### 5. Delete Room Type
```graphql
mutation {
  deleteRoomType(id: 1) {
    success
    message
  }
}
```

## 🔍 Advanced Search Examples

### Multi-Criteria Search
```graphql
query {
  searchRoomTypes(input: {
    hotelId: 1,
    name: "suite",
    minPrice: 150,
    maxPrice: 400,
    maxOccupancy: 4,
    adults: 2,
    children: 2,
    amenities: ["WiFi", "AirConditioning", "MiniBar", "Balcony"],
    isActive: true,
    limit: 20,
    offset: 0
  }) {
    id
    name
    description
    basePrice
    maxOccupancy
    adults
    children
    amenities
    isActive
  }
}
```

### Price Range Search
```graphql
query {
  searchRoomTypes(input: {
    hotelId: 1,
    minPrice: 100,
    maxPrice: 200,
    adults: 2,
    limit: 15
  }) {
    id
    name
    basePrice
    maxOccupancy
    amenities
  }
}
```

## 📊 Business Rules

### Validation Rules
- Room type name must be unique per hotel
- Base price must be positive number
- Max occupancy must be >= adults + children
- All capacity values must be positive integers
- Amenities array must contain valid amenity strings

### Authorization Rules
- Only hotel owners can create, update, delete their room types
- Users can only view room types for their hotels
- All mutations require valid JWT token
- Hotel ownership verified before any modification

### Search Behavior
- Name search is case-insensitive partial match
- Multiple filters are combined with AND logic
- Amenities filter requires all specified amenities
- Price range filtering is inclusive
- Pagination limits: max 100 results per request

## 🧪 Testing

### GraphQL Playground
Visit `http://localhost:3000/graphql` to test operations interactively.

### Sample Test Data
```graphql
# Create sample room type
mutation {
  createRoomType(input: {
    name: "Standard Room",
    description: "Comfortable standard room",
    basePrice: 120.00,
    maxOccupancy: 2,
    adults: 2,
    children: 0,
    amenities: ["WiFi", "AirConditioning", "TV", "WorkDesk"]
  }) {
    id
    name
    basePrice
    maxOccupancy
    createdAt
  }
}
```

## 📚 Additional Resources

- [Hotel API Documentation](../hotel/documentation/README.md)
- [Room API Documentation](../room/documentation/README.md)
- [Authentication Guide](../../../common/guards/README.md)
- [Database Models](../../../database/models/README.md)

## 📋 Module Structure

```
src/modules/room-type/
├── room-type.module.ts          # Module definition
├── room-type.resolver.ts         # GraphQL resolvers
├── room-type.service.ts          # Business logic
├── room-type.repository.ts       # Database operations
├── dto/
│   └── room-type.input.ts       # Input validation DTOs
└── documentation/
    └── README.md               # This documentation
```
