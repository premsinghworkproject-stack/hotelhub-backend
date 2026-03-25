# Hotel Module API Documentation

## 📚 Overview

The Hotel module provides comprehensive hotel management capabilities with full CRUD operations, advanced search functionality, and geospatial queries. All mutations are protected with JWT authentication.

## 🔐 Authentication

All mutations require JWT authentication. Include the `Authorization` header with your JWT token:

```
Authorization: Bearer <your-jwt-token>
```

## � Available Operations

### 🏨 Queries (Public & Protected)

#### `hotel`
Get a specific hotel by ID.

```graphql
query GetHotel($id: Int!) {
  hotel(id: $id) {
    id
    name
    address
    city
    state
    country
    postalCode
    phone
    email
    website
    description
    latitude
    longitude
    rating
    totalReviews
    mealPlan
    propertyType
    checkInTime
    checkOutTime
    cancellationPolicy
    petPolicy
    parkingInfo
    isActive
    ownerId
    createdAt
    updatedAt
  }
}
```

#### `hotels`
Get all hotels with pagination support.

```graphql
query GetHotels($limit: Int, $offset: Int) {
  hotels(limit: $limit, offset: $offset) {
    id
    name
    city
    country
    rating
    totalReviews
    isActive
  }
}
```

#### `hotelsByOwner` 🔒
Get hotels owned by the authenticated user.

```graphql
query GetMyHotels($limit: Int, $offset: Int) {
  hotelsByOwner(limit: $limit, offset: $offset) {
    id
    name
    address
    city
    state
    country
    rating
    totalReviews
    isActive
    createdAt
  }
}
```

#### `searchHotels`
Comprehensive hotel search with multiple filters.

```graphql
query SearchHotels($input: SearchHotelsInput!) {
  searchHotels(input: $input) {
    id
    name
    address
    city
    state
    country
    rating
    totalReviews
    mealPlan
    propertyType
    basePrice
    amenities
  }
}
```

**SearchHotelsInput Fields:**
- `searchQuery`: Full-text search (name, description, address, city)
- `city`: Filter by city
- `state`: Filter by state
- `country`: Filter by country
- `minRating`: Minimum rating (1-5)
- `maxRating`: Maximum rating (1-5)
- `minPrice`: Minimum base price
- `maxPrice`: Maximum base price
- `mealPlan`: Filter by meal plan
- `propertyType`: Filter by property type
- `amenities`: Array of required amenities
- `adults`: Minimum adult capacity
- `children`: Minimum children capacity
- `checkInDate`: Check-in date filter
- `checkOutDate`: Check-out date filter
- `limit`: Results limit (default: 20)
- `offset`: Results offset (default: 0)

#### `hotelCount`
Get total count of hotels in the system.

```graphql
query GetHotelCount {
  hotelCount
}
```

#### `searchNearby`
Find hotels near a specific location using geospatial search.

```graphql
query SearchNearby($latitude: Float!, $longitude: Float!, $radiusKm: Int) {
  searchNearby(latitude: $latitude, longitude: $longitude, radiusKm: $radiusKm) {
    id
    name
    address
    city
    latitude
    longitude
    rating
    distance
  }
}
```

### 🔧 Mutations (All Protected)

#### `createHotel` 🔒
Create a new hotel.

```graphql
mutation CreateHotel($input: CreateHotelInput!) {
  createHotel(input: $input) {
    id
    name
    address
    city
    state
    country
    postalCode
    phone
    email
    website
    description
    latitude
    longitude
    rating
    totalReviews
    mealPlan
    propertyType
    checkInTime
    checkOutTime
    cancellationPolicy
    petPolicy
    parkingInfo
    isActive
    ownerId
    createdAt
  }
}
```

**CreateHotelInput Fields:**
- `name`: Hotel name (required)
- `address`: Street address (required)
- `city`: City (required)
- `state`: State/province (required)
- `country`: Country (required)
- `postalCode`: Postal/ZIP code (required)
- `phone`: Phone number (required)
- `email`: Contact email (required)
- `website`: Hotel website (optional)
- `description`: Hotel description (optional)
- `latitude`: Latitude coordinate (optional)
- `longitude`: Longitude coordinate (optional)
- `rating`: Initial rating (optional, default: 0)
- `totalReviews`: Initial review count (optional, default: 0)
- `mealPlan`: Meal plan type (optional)
- `propertyType`: Property type (optional)
- `checkInTime`: Check-in time (optional)
- `checkOutTime`: Check-out time (optional)
- `cancellationPolicy`: Cancellation policy (optional)
- `petPolicy`: Pet policy (optional)
- `parkingInfo`: Parking information (optional)

#### `updateHotel` 🔒
Update hotel details.

```graphql
mutation UpdateHotel($id: Int!, $input: UpdateHotelInput!) {
  updateHotel(id: $id, input: $input) {
    id
    name
    address
    city
    state
    country
    rating
    totalReviews
    updatedAt
  }
}
```

**UpdateHotelInput Fields:** All CreateHotelInput fields are optional for partial updates.

#### `deleteHotel` 🔒
Delete a hotel.

```graphql
mutation DeleteHotel($id: Int!) {
  deleteHotel(id: $id) {
    success
    message
  }
}
```

#### `toggleHotelActiveStatus` �
Toggle hotel active status.

```graphql
mutation ToggleHotelStatus($id: Int!, $isActive: Boolean!) {
  toggleHotelActiveStatus(id: $id, isActive: $isActive) {
    id
    name
    isActive
    updatedAt
  }
}
```

## 🎯 Enums

### `MealPlan`
- `ROOM_ONLY`: Room only
- `BED_AND_BREAKFAST`: Bed & breakfast
- `HALF_BOARD`: Half board
- `FULL_BOARD`: Full board
- `ALL_INCLUSIVE`: All inclusive

### `PropertyType`
- `HOTEL`: Hotel
- `RESORT`: Resort
- `MOTEL`: Motel
- `GUEST_HOUSE`: Guest house
- `HOSTEL`: Hostel
- `APARTMENT`: Apartment
- `VILLA`: Villa

## ⚠️ Error Handling

### Common Error Codes

#### `BAD_REQUEST`
- Invalid input data
- Missing required fields
- Invalid ID format

#### `NOT_FOUND`
- Hotel not found
- Resource doesn't exist

#### `FORBIDDEN`
- Unauthorized access (not hotel owner)
- Permission denied

#### `CONFLICT`
- Duplicate resource
- Business rule violation

#### `INTERNAL_SERVER_ERROR`
- Database errors
- Unexpected server errors

### Error Response Format

```json
{
  "errors": [
    {
      "message": "Hotel not found",
      "extensions": {
        "code": "NOT_FOUND",
        "field": "id"
      }
    }
  ]
}
```

## 🚀 Usage Examples

### Complete Hotel Management Flow

#### 1. Create a Hotel
```graphql
mutation {
  createHotel(input: {
    name: "Grand Plaza Hotel",
    address: "123 Main Street",
    city: "New York",
    state: "NY",
    country: "USA",
    postalCode: "10001",
    phone: "+1-555-0123",
    email: "info@grandplaza.com",
    website: "https://grandplaza.com",
    description: "Luxury hotel in downtown Manhattan",
    latitude: 40.7128,
    longitude: -74.0060,
    mealPlan: BED_AND_BREAKFAST,
    propertyType: HOTEL,
    checkInTime: "15:00",
    checkOutTime: "11:00"
  }) {
    id
    name
    city
    rating
    createdAt
  }
}
```

#### 2. Search Hotels
```graphql
query {
  searchHotels(input: {
    city: "New York",
    minRating: 4,
    maxPrice: 300,
    amenities: ["WiFi", "Pool", "Spa"],
    adults: 2,
    limit: 10
  }) {
    id
    name
    address
    rating
    basePrice
    amenities
  }
}
```

#### 3. Find Nearby Hotels
```graphql
query {
  searchNearby(latitude: 40.7128, longitude: -74.0060, radiusKm: 5) {
    id
    name
    address
    distance
    rating
  }
}
```

#### 4. Update Hotel
```graphql
mutation {
  updateHotel(id: 1, input: {
    name: "Grand Plaza Hotel - Updated",
    rating: 4.5
  }) {
    id
    name
    rating
    updatedAt
  }
}
```

#### 5. Toggle Hotel Status
```graphql
mutation {
  toggleHotelActiveStatus(id: 1, isActive: false) {
    id
    name
    isActive
    updatedAt
  }
}
```

## 🔍 Advanced Search Examples

### Multi-Criteria Search
```graphql
query {
  searchHotels(input: {
    searchQuery: "luxury",
    city: "New York",
    minRating: 4,
    maxPrice: 500,
    mealPlan: FULL_BOARD,
    propertyType: RESORT,
    amenities: ["WiFi", "Pool", "Spa", "Gym", "Restaurant"],
    adults: 2,
    children: 1,
    checkInDate: "2024-06-15",
    checkOutDate: "2024-06-20",
    limit: 20,
    offset: 0
  }) {
    id
    name
    description
    rating
    basePrice
    mealPlan
    propertyType
    amenities
    maxOccupancy
  }
}
```

### Location-Based Search
```graphql
query {
  searchHotels(input: {
    country: "USA",
    state: "California",
    minRating: 3,
    maxPrice: 200,
    amenities: ["WiFi", "Parking"],
    adults: 2
  }) {
    id
    name
    city
    state
    rating
    basePrice
    amenities
  }
}
```

## 📊 Business Rules

### Validation Rules
- Hotel name must be unique per owner
- Rating must be between 0-5
- Coordinates must be valid (latitude: -90 to 90, longitude: -180 to 180)
- Email must be valid format
- Phone number must be valid format

### Authorization Rules
- Only hotel owners can create, update, delete their hotels
- Users can only view their own hotels via `hotelsByOwner`
- All mutations require valid JWT token
- Hotel ownership verified before any modification

### Search Behavior
- Text search is case-insensitive
- Multiple filters are combined with AND logic
- Amenities filter requires all specified amenities
- Geospatial search uses bounding box approximation
- Pagination limits: max 100 results per request

## 🧪 Testing

### GraphQL Playground
Visit `http://localhost:3000/graphql` to test operations interactively.

### Sample Test Data
```graphql
# Create sample hotel
mutation {
  createHotel(input: {
    name: "Test Hotel",
    address: "456 Test Ave",
    city: "Test City",
    state: "TS",
    country: "USA",
    postalCode: "12345",
    phone: "+1-555-9999",
    email: "test@testhotel.com"
  }) {
    id
    name
    city
    createdAt
  }
}
```

## 📚 Additional Resources

- [Room Type API Documentation](../room-type/documentation/README.md)
- [Room API Documentation](../room/documentation/README.md)
- [Authentication Guide](../../../common/guards/README.md)
- [Database Models](../../../database/models/README.md)
- [Error Handling](./hotel-api.md#error-handling) - Common error scenarios

## 📋 Module Structure

```
src/modules/hotel/
├── hotel.module.ts          # Module definition
├── hotel.resolver.ts         # GraphQL resolvers with documentation
├── hotel.service.ts          # Business logic
├── hotel.repository.ts       # Database operations
├── models/
│   └── hotel.model.ts        # Sequelize model
└── documentation/
    ├── README.md           # This file
    └── hotel-api.md         # Complete API documentation
```

## 🎯 Key Features

### **Hotel Management**
- **Registration**: Create new hotels with validation
- **Profile Retrieval**: Get hotel details with relationships
- **Hotel Directory**: List all hotels with pagination
- **Search**: Case-insensitive partial name search

### **Data Integrity**
- **Input Validation**: Comprehensive data validation
- **Price Validation**: Positive number checking
- **Relationship Loading**: Automatic inclusion of hotel bookings

### **Performance**
- **Pagination**: Efficient data loading (10 items per page)
- **Search Optimization**: Fast name-based searching
- **Relationship Loading**: Smart inclusion of related data

## 🛠️ Development Notes

### **Resolver Documentation**
All resolvers include:
- JSDoc comments with detailed descriptions
- GraphQL schema descriptions
- Example queries with variables
- Complete response examples
- Error scenario documentation

### **Type Safety**
- Full TypeScript support
- GraphQL schema generation
- Input validation with class-validator
- Auto-generated types

## 📞 Support

For questions about the hotel module:
1. Check the [complete API documentation](./hotel-api.md)
2. Test queries in [GraphQL Playground](http://localhost:3000/graphql)
3. Review error handling examples
4. Check business rules and constraints
