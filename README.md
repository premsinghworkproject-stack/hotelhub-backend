# Hotel Booking System - NestJS Backend

A production-ready NestJS backend for a hotel booking system using GraphQL (Apollo Server), Sequelize ORM, and PostgreSQL.

## 🚀 Tech Stack

* NestJS (latest)
* GraphQL (code-first approach with ApolloDriver)
* Sequelize ORM
* PostgreSQL
* TypeScript
* class-validator + class-transformer
* dotenv for environment config

## 📁 Project Structure

```
src/
├── main.ts
├── app.module.ts
├── common/
│   ├── guards/
│   ├── interceptors/
│   ├── filters/
│   ├── decorators/
│   └── utils/
├── database/
│   ├── database.module.ts
│   ├── database.providers.ts
│   └── sequelize.config.ts
├── modules/
│   ├── user/
│   │   ├── dto/
│   │   ├── models/
│   │   ├── user.module.ts
│   │   ├── user.service.ts
│   │   ├── user.resolver.ts
│   │   └── user.repository.ts
│   ├── hotel/
│   │   ├── dto/
│   │   ├── models/
│   │   ├── hotel.module.ts
│   │   ├── hotel.service.ts
│   │   ├── hotel.resolver.ts
│   │   └── hotel.repository.ts
│   ├── booking/
│   │   ├── dto/
│   │   ├── models/
│   │   ├── booking.module.ts
│   │   ├── booking.service.ts
│   │   ├── booking.resolver.ts
│   │   └── booking.repository.ts
```

## ⚙️ Environment Configuration

Create a `.env` file in the root directory:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=password
DB_NAME=booking_db
NODE_ENV=development
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your PostgreSQL database and update the `.env` file with your database credentials

4. Run the application in development mode:
   ```bash
   npm run start:dev
   ```

### Build & Production

```bash
# Build the application
npm run build

# Run in production mode
npm run start
```

## 📊 GraphQL Schema

### Queries

```graphql
# Get all users
query {
  users {
    id
    name
    email
  }
}

# Get user by ID
query {
  user(id: "user-id") {
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

# Get all hotels with pagination
query {
  hotels(limit: 10, offset: 0) {
    id
    name
    location
    price
  }
}

# Get hotel by ID
query {
  hotel(id: "hotel-id") {
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

# Search hotels by name
query {
  searchHotels(name: "Grand Hotel") {
    id
    name
    location
    price
  }
}

# Get all bookings
query {
  bookings {
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

# Get bookings by user
query {
  bookingsByUser(userId: "user-id") {
    id
    checkIn
    checkOut
    hotel {
      name
      location
    }
  }
}

# Get bookings by hotel
query {
  bookingsByHotel(hotelId: "hotel-id") {
    id
    checkIn
    checkOut
    user {
      name
      email
    }
  }
}
```

### Mutations

```graphql
# Create a new user
mutation {
  createUser(input: {
    name: "John Doe"
    email: "john@example.com"
  }) {
    id
    name
    email
  }
}

# Create a new booking
mutation {
  createBooking(input: {
    userId: "user-id"
    hotelId: "hotel-id"
    checkIn: "2024-06-01"
    checkOut: "2024-06-05"
  }) {
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
```

## 🏗️ Architecture

The application follows a clean architecture pattern:

- **Resolver Layer**: Handles GraphQL queries and mutations
- **Service Layer**: Contains business logic
- **Repository Layer**: Abstracts database operations
- **Model Layer**: Defines Sequelize models with GraphQL decorators

## 🔧 Features

- ✅ UUID primary keys for all entities
- ✅ Proper Sequelize associations (hasMany/belongsTo)
- ✅ Input validation with class-validator
- ✅ Global exception handling
- ✅ Request/response logging
- ✅ CORS configuration
- ✅ Environment-based configuration
- ✅ Pagination support for hotels
- ✅ Booking conflict prevention
- ✅ Code-first GraphQL schema generation
- ✅ Ready for authentication (JWT) implementation

## 🌐 GraphQL Playground

When running in development mode, you can access the GraphQL Playground at:
`http://localhost:3000/graphql`

## 📝 Database Models

### User
- id (UUID, Primary Key)
- name (string)
- email (unique string)

### Hotel
- id (UUID, Primary Key)
- name (string)
- location (string)
- price (decimal)

### Booking
- id (UUID, Primary Key)
- userId (UUID, Foreign Key)
- hotelId (UUID, Foreign Key)
- checkIn (Date)
- checkOut (Date)

## 🔗 Relationships

- User hasMany Bookings
- Hotel hasMany Bookings
- Booking belongsTo User
- Booking belongsTo Hotel

## 🚀 Production Considerations

- The application is configured for production with proper error handling
- Database synchronization is disabled in production
- Logging is optimized for production environments
- Ready for JWT authentication implementation
- Modular structure supports role-based access control
