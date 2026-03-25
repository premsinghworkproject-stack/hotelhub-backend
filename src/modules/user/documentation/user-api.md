# User Module Documentation

## 📋 Overview
The User module handles all user-related operations including creating users, retrieving user information, and managing user data.

## 🔧 Available Operations

### 📝 Mutations

#### `createUser`
Creates a new user in the system.

**GraphQL Query:**
```graphql
mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    name
    email
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "input": {
    "name": "John Doe",
    "email": "john.doe@example.com"
  }
}
```

**Response:**
```json
{
  "data": {
    "createUser": {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "createdAt": "2024-03-19T15:30:00.000Z",
      "updatedAt": "2024-03-19T15:30:00.000Z"
    }
  }
}
```

**Validation Rules:**
- `name`: Required, must be a non-empty string
- `email`: Required, must be a valid email format
- `email`: Must be unique in the system

**Error Responses:**
```json
// Email already exists
{
  "errors": [
    {
      "message": "User with this email already exists",
      "code": "CONFLICT"
    }
  ]
}

// Invalid email format
{
  "errors": [
    {
      "message": "email must be an email",
      "code": "BAD_USER_INPUT"
    }
  ]
}
```

---

### 🔍 Queries

#### `user`
Retrieves a specific user by their ID.

**GraphQL Query:**
```graphql
query GetUser($id: Int!) {
  user(id: $id) {
    id
    name
    email
    createdAt
    updatedAt
    bookings {
      id
      hotelId
      checkIn
      checkOut
      hotel {
        name
        location
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
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "createdAt": "2024-03-19T15:30:00.000Z",
      "updatedAt": "2024-03-19T15:30:00.000Z",
      "bookings": [
        {
          "id": 1,
          "hotelId": 1,
          "checkIn": "2024-03-20T00:00:00.000Z",
          "checkOut": "2024-03-23T00:00:00.000Z",
          "hotel": {
            "name": "Grand Plaza Hotel",
            "location": "New York, NY"
          }
        }
      ]
    }
  }
}
```

**Error Responses:**
```json
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

#### `users`
Retrieves all users in the system.

**GraphQL Query:**
```graphql
query GetAllUsers {
  users {
    id
    name
    email
    createdAt
    updatedAt
  }
}
```

**Response:**
```json
{
  "data": {
    "users": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john.doe@example.com",
        "createdAt": "2024-03-19T15:30:00.000Z",
        "updatedAt": "2024-03-19T15:30:00.000Z"
      },
      {
        "id": 2,
        "name": "Jane Smith",
        "email": "jane.smith@example.com",
        "createdAt": "2024-03-19T15:31:00.000Z",
        "updatedAt": "2024-03-19T15:31:00.000Z"
      }
    ]
  }
}
```

---

## 📊 Data Types

### User Model
```typescript
interface User {
  id: number;        // Auto-increment primary key
  name: string;      // User's full name
  email: string;     // User's email (unique)
  createdAt: Date;   // Creation timestamp
  updatedAt: Date;   // Update timestamp
  bookings?: Booking[]; // User's bookings (optional)
}
```

### CreateUserInput
```typescript
interface CreateUserInput {
  name: string;   // Required: User's full name
  email: string;  // Required: User's email (must be unique)
}
```

---

## 🔗 Relationships

### User ↔ Bookings
- **Type**: One-to-Many
- **Foreign Key**: `booking.userId` → `user.id`
- **Access**: `user.bookings` returns user's bookings

---

## 🚀 Usage Examples

### **Complete User Flow**
```graphql
# 1. Create a user
mutation CreateUser {
  createUser(input: {
    name: "John Doe",
    email: "john.doe@example.com"
  }) {
    id
    name
    email
  }
}

# 2. Get user details with bookings
query GetUserWithBookings {
  user(id: 1) {
    id
    name
    email
    bookings {
      id
      checkIn
      checkOut
      hotel {
        name
        location
      }
    }
  }
}

# 3. Get all users
query GetAllUsers {
  users {
    id
    name
    email
    createdAt
  }
}
```

---

## ⚠️ Business Rules

1. **Email Uniqueness**: Each email can only be used once
2. **Name Validation**: Name cannot be empty
3. **Email Format**: Must be a valid email address

---

## 🛠️ Error Handling

| Error Type | HTTP Code | GraphQL Code | Description |
|-------------|-----------|--------------|-------------|
| Not Found | 404 | NOT_FOUND | User not found |
| Conflict | 409 | CONFLICT | Email already exists |
| Bad Request | 400 | BAD_USER_INPUT | Invalid input data |

---

## 📝 Testing Tips

1. **Use GraphQL Playground**: `http://localhost:3000/graphql`
2. **Test Email Uniqueness**: Try creating duplicate emails
3. **Check Relationships**: Verify bookings appear in user data
4. **Test Invalid Data**: Try empty names, invalid emails
5. **Verify Timestamps**: Check createdAt/updatedAt fields

---

## 🎯 Common Use Cases

### **User Registration**
```graphql
mutation RegisterUser {
  createUser(input: {
    name: "Alice Johnson",
    email: "alice@example.com"
  }) {
    id
    name
    email
    createdAt
  }
}
```

### **User Profile with Bookings**
```graphql
query UserProfile {
  user(id: 1) {
    id
    name
    email
    bookings {
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
}
```

### **User Directory**
```graphql
query UserDirectory {
  users {
    id
    name
    email
    createdAt
  }
}
```
