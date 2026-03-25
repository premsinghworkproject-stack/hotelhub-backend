# Hotel Module Documentation Index

## 📚 Available Documentation

### 📖 [Hotel API Documentation](./hotel-api.md)
Complete reference for all hotel operations including:
- **Mutations**: `createHotel`
- **Queries**: `hotel`, `hotels`, `searchHotels`
- **Data Types**: Hotel model, PartialHotelInput
- **Examples**: Complete GraphQL queries with responses
- **Error Handling**: All possible error scenarios
- **Business Rules**: Validation and constraints

## 🚀 Quick Links

### **Common Operations**
- [Create Hotel](./hotel-api.md#createhotel) - Register a new hotel
- [Get Hotel](./hotel-api.md#hotel) - Retrieve hotel details
- [All Hotels](./hotel-api.md#hotels) - Get hotel directory with pagination
- [Search Hotels](./hotel-api.md#searchhotels) - Find hotels by name

### **Testing & Development**
- [GraphQL Playground](http://localhost:3000/graphql) - Interactive testing
- [Complete Examples](./hotel-api.md#usage-examples) - Ready-to-use queries
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
