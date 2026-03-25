# Hotel Module Documentation

## 📋 Overview
The Hotel module handles all hotel-related operations including creating hotels, retrieving hotel information, searching hotels, and managing hotel data.

## 🔧 Available Operations

### 📝 Mutations

#### `createHotel`
Creates a new hotel in the system.

**GraphQL Query:**
```graphql
mutation CreateHotel($input: PartialHotelInput!) {
  createHotel(input: $input) {
    id
    name
    location
    price
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "input": {
    "name": "Grand Plaza Hotel",
    "location": "New York, NY",
    "price": 250.00
  }
}
```

**Response:**
```json
{
  "data": {
    "createHotel": {
      "id": 1,
      "name": "Grand Plaza Hotel",
      "location": "New York, NY",
      "price": 250.00,
      "createdAt": "2024-03-19T15:30:00.000Z",
      "updatedAt": "2024-03-19T15:30:00.000Z"
    }
  }
}
```

**Validation Rules:**
- `name`: Required, must be a non-empty string
- `location`: Required, must be a non-empty string
- `price`: Required, must be a positive number

**Error Responses:**
```json
// Invalid input
{
  "errors": [
    {
      "message": "name must not be empty",
      "code": "BAD_USER_INPUT"
    }
  ]
}
```

---

### 🔍 Queries

#### `hotel`
Retrieves a specific hotel by its ID.

**GraphQL Query:**
```graphql
query GetHotel($id: Int!) {
  hotel(id: $id) {
    id
    name
    location
    price
    createdAt
    updatedAt
    bookings {
      id
      userId
      checkIn
      checkOut
      user {
        name
        email
      }
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
    "hotel": {
      "id": 1,
      "name": "Grand Plaza Hotel",
      "location": "New York, NY",
      "price": 250.00,
      "createdAt": "2024-03-19T15:30:00.000Z",
      "updatedAt": "2024-03-19T15:30:00.000Z",
      "bookings": [
        {
          "id": 1,
          "userId": 1,
          "checkIn": "2024-03-20T00:00:00.000Z",
          "checkOut": "2024-03-23T00:00:00.000Z",
          "user": {
            "name": "John Doe",
            "email": "john.doe@example.com"
          }
        }
      ]
    }
  }
}
```

**Error Responses:**
```json
// Hotel not found
{
  "errors": [
    {
      "message": "Hotel not found",
      "code": "NOT_FOUND"
    }
  ]
}
```

---

#### `hotels`
Retrieves all hotels in the system with pagination support.

**GraphQL Query:**
```graphql
query GetAllHotels($limit: Int, $offset: Int) {
  hotels(limit: $limit, offset: $offset) {
    id
    name
    location
    price
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "limit": 10,
  "offset": 0
}
```

**Response:**
```json
{
  "data": {
    "hotels": [
      {
        "id": 1,
        "name": "Grand Plaza Hotel",
        "location": "New York, NY",
        "price": 250.00,
        "createdAt": "2024-03-19T15:30:00.000Z",
        "updatedAt": "2024-03-19T15:30:00.000Z"
      },
      {
        "id": 2,
        "name": "Seaside Resort",
        "location": "Miami, FL",
        "price": 180.00,
        "createdAt": "2024-03-19T15:31:00.000Z",
        "updatedAt": "2024-03-19T15:31:00.000Z"
      }
    ]
  }
}
```

**Default Values:**
- `limit`: 10 (maximum 10 hotels per page)
- `offset`: 0 (starting from first hotel)

---

#### `searchHotels`
Searches for hotels by name (case-insensitive partial match).

**GraphQL Query:**
```graphql
query SearchHotels($name: String!) {
  searchHotels(name: $name) {
    id
    name
    location
    price
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "name": "plaza"
}
```

**Response:**
```json
{
  "data": {
    "searchHotels": [
      {
        "id": 1,
        "name": "Grand Plaza Hotel",
        "location": "New York, NY",
        "price": 250.00,
        "createdAt": "2024-03-19T15:30:00.000Z",
        "updatedAt": "2024-03-19T15:30:00.000Z"
      }
    ]
  }
}
```

**Search Behavior:**
- Case-insensitive matching
- Partial string matching
- Returns all hotels containing the search term

---

## 📊 Data Types

### Hotel Model
```typescript
interface Hotel {
  id: number;        // Auto-increment primary key
  name: string;      // Hotel name
  location: string;  // Hotel location
  price: number;     // Price per night
  createdAt: Date;   // Creation timestamp
  updatedAt: Date;   // Update timestamp
  bookings?: Booking[]; // Hotel's bookings (optional)
}
```

### PartialHotelInput
```typescript
interface PartialHotelInput {
  name?: string;     // Optional: Hotel name
  location?: string; // Optional: Hotel location
  price?: number;    // Optional: Price per night
}
```

---

## 🔗 Relationships

### Hotel ↔ Bookings
- **Type**: One-to-Many
- **Foreign Key**: `booking.hotelId` → `hotel.id`
- **Access**: `hotel.bookings` returns hotel's bookings

---

## 🚀 Usage Examples

### **Complete Hotel Flow**
```graphql
# 1. Create a hotel
mutation CreateHotel {
  createHotel(input: {
    name: "Grand Plaza Hotel",
    location: "New York, NY",
    price: 250.00
  }) {
    id
    name
    location
    price
  }
}

# 2. Get hotel details with bookings
query GetHotelWithBookings {
  hotel(id: 1) {
    id
    name
    location
    price
    bookings {
      id
      checkIn
      checkOut
      user {
        name
        email
      }
    }
  }
}

# 3. Search hotels
query SearchHotels {
  searchHotels(name: "plaza") {
    id
    name
    location
    price
  }
}

# 4. Get all hotels with pagination
query GetAllHotels {
  hotels(limit: 5, offset: 0) {
    id
    name
    location
    price
  }
}
```

---

## ⚠️ Business Rules

1. **Name Validation**: Hotel name cannot be empty
2. **Location Validation**: Location cannot be empty
3. **Price Validation**: Price must be a positive number
4. **Pagination**: Maximum 10 hotels per page

---

## 🛠️ Error Handling

| Error Type | HTTP Code | GraphQL Code | Description |
|-------------|-----------|--------------|-------------|
| Not Found | 404 | NOT_FOUND | Hotel not found |
| Bad Request | 400 | BAD_USER_INPUT | Invalid input data |

---

## 📝 Testing Tips

1. **Use GraphQL Playground**: `http://localhost:3000/graphql`
2. **Test Search**: Try partial name matches
3. **Test Pagination**: Use different limit/offset values
4. **Check Relationships**: Verify bookings appear in hotel data
5. **Test Invalid Data**: Try empty names, negative prices

---

## 🎯 Common Use Cases

### **Hotel Registration**
```graphql
mutation RegisterHotel {
  createHotel(input: {
    name: "Mountain Lodge",
    location: "Denver, CO",
    price: 120.00
  }) {
    id
    name
    location
    price
    createdAt
  }
}
```

### **Hotel Search**
```graphql
query FindHotels {
  searchHotels(name: "resort") {
    id
    name
    location
    price
  }
}
```

### **Hotel Directory with Pagination**
```graphql
query HotelDirectory {
  hotels(limit: 10, offset: 0) {
    id
    name
    location
    price
    createdAt
  }
}
```

### **Hotel Profile with Bookings**
```graphql
query HotelProfile {
  hotel(id: 1) {
    id
    name
    location
    price
    bookings {
      id
      checkIn
      checkOut
      user {
        name
        email
      }
    }
  }
}
```

---

## 🔍 Advanced Search Examples

### **Case-Insensitive Search**
```graphql
query SearchCaseInsensitive {
  searchHotels(name: "PLAZA") {
    id
    name
    location
    price
  }
}
```

### **Partial Match Search**
```graphql
query SearchPartial {
  searchHotels(name: "grand") {
    id
    name
    location
    price
  }
}
```

### **Location-Based Search**
```graphql
query SearchByLocation {
  searchHotels(name: "york") {
    id
    name
    location
    price
  }
}
```
