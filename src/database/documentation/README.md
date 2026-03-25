# Database Documentation Index

## 📚 Complete Database Documentation

This folder contains all database-related documentation and configuration for the booking system.

## 🗂️ Database Structure

```
src/database/
├── config/
│   └── config.js              # Database configuration for all environments
├── models/                      # Sequelize models with relationships
│   ├── user.model.ts           # User model with bookings relationship
│   ├── hotel.model.ts          # Hotel model with bookings relationship
│   └── booking.model.ts        # Booking model with user/hotel relationships
├── migrations/                  # Database schema migrations
│   ├── 20240319000001-create-users.js
│   ├── 20240319000002-create-hotels.js
│   └── 20240319000003-create-bookings.js
├── seeders/                     # Database seeders with duplicate handling
│   ├── 20240319000001-demo-users.js
│   ├── 20240319000002-demo-hotels.js
│   └── 20240319000003-demo-bookings.js
├── database.module.ts           # NestJS database module
├── sequelize.config.ts          # Sequelize configuration with auto-loading
└── documentation/
    └── README.md               # This file
```

## 🚀 Module Documentation

### 📖 [Booking Module](../modules/booking/documentation/)
Complete booking system documentation:
- **API Reference**: All mutations and queries
- **Examples**: Ready-to-use GraphQL queries
- **Error Handling**: Comprehensive error scenarios
- **Business Rules**: Booking validation and constraints

### 📖 [User Module](../modules/user/documentation/)
User management documentation:
- **API Reference**: User CRUD operations
- **Examples**: User registration and profile queries
- **Error Handling**: Email uniqueness and validation
- **Business Rules**: User data constraints

### 📖 [Hotel Module](../modules/hotel/documentation/)
Hotel management documentation:
- **API Reference**: Hotel CRUD operations with search
- **Examples**: Hotel registration and search queries
- **Error Handling**: Input validation scenarios
- **Business Rules**: Hotel data constraints

## 🔧 Database Configuration

### **Environment Support**
- ✅ **Development**: Local PostgreSQL with logging
- ✅ **Test**: Separate test database
- ✅ **Production**: Optimized configuration with SSL

### **Key Features**
- **Auto-loading Models**: Dynamic model discovery
- **Smart Seeders**: Duplicate-safe data seeding
- **Migration Support**: Schema versioning
- **SSL Configuration**: Secure database connections

## 📊 Database Schema

### **Relationships**
```
Users (1) ←→ (N) Bookings (N) ←→ (1) Hotels
```

### **Tables**
- **users**: User accounts with unique emails
- **hotels**: Hotel information with pricing
- **bookings**: Booking records with date ranges

### **Indexes**
- **Primary Keys**: Auto-increment integers for performance
- **Foreign Keys**: Optimized for join operations
- **Unique Constraints**: Email uniqueness in users table

## 🛠️ Database Operations

### **Migrations**
```bash
# Run pending migrations
npm run db:migrate

# Undo last migration
npm run db:migrate:undo
```

### **Seeders**
```bash
# Seed database with demo data
npm run db:seed

# Undo all seeders
npm run db:seed:undo
```

### **Reset Database**
```bash
# Complete reset (migrations + seeders)
npm run db:reset
```

## 🎯 Best Practices

### **Model Design**
- **Integer IDs**: Auto-increment for performance
- **Relationships**: Proper foreign key constraints
- **Timestamps**: Automatic creation/update tracking
- **Validation**: Input validation at model level

### **Migration Strategy**
- **Version Control**: Timestamped migration files
- **Rollback Support**: Down migrations included
- **Environment Specific**: Different configs per environment
- **Production Safe**: No auto-sync in production

### **Seeding Strategy**
- **Idempotent**: Safe to run multiple times
- **Duplicate Handling**: Smart conflict resolution
- **Data Integrity**: Foreign key relationships maintained
- **Demo Data**: Realistic test data

## 📋 Configuration Files

### **Sequelize Config** (`sequelize.config.ts`)
- Dynamic model loading
- Environment-based configuration
- SSL support for production
- Auto-model discovery

### **Database Config** (`config/config.js`)
- Environment-specific settings
- SSL configuration
- Connection parameters
- Logging configuration

### **CLI Config** (`.sequelizerc.js`)
- Migration paths
- Seeder paths
- Model paths
- Configuration location

## 🔍 Monitoring & Debugging

### **Development Logging**
- Query logging enabled
- Connection status
- Migration status
- Seeder results

### **Error Handling**
- Database connection errors
- Migration failures
- Seeder conflicts
- Model validation errors

## 📞 Support

For database-related questions:
1. Check module-specific documentation
2. Review migration/seeders logs
3. Verify environment configuration
4. Test with GraphQL Playground

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up database
npm run db:migrate
npm run db:seed

# 3. Start development server
npm run start:dev

# 4. Open GraphQL Playground
# http://localhost:3000/graphql
```

The database system is now fully documented and ready for development! 🎯
