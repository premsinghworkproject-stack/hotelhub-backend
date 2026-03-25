# Booking Module Documentation Index

## 📚 Available Documentation

### 📖 [Booking API Documentation](./booking-api.md)
Complete reference for all booking operations including:
- **Mutations**: `createBooking`
- **Queries**: `booking`, `bookings`, `bookingsByUser`, `bookingsByHotel`
- **Data Types**: Booking model, CreateBookingInput
- **Examples**: Complete GraphQL queries with responses
- **Error Handling**: All possible error scenarios
- **Business Rules**: Validation and constraints

## 🚀 Quick Links

### **Common Operations**
- [Create Booking](./booking-api.md#createbooking) - Book a hotel
- [Get Booking](./booking-api.md#booking) - Retrieve booking details
- [User Bookings](./booking-api.md#bookingsbyuser) - Get user's bookings
- [Hotel Bookings](./booking-api.md#bookingsbyhotel) - Get hotel's bookings

### **Testing & Development**
- [GraphQL Playground](http://localhost:3000/graphql) - Interactive testing
- [Complete Examples](./booking-api.md#usage-examples) - Ready-to-use queries
- [Error Handling](./booking-api.md#error-handling) - Common error scenarios

## 📋 Module Structure

```
src/modules/booking/
├── booking.module.ts          # Module definition
├── booking.resolver.ts         # GraphQL resolvers with documentation
├── booking.service.ts          # Business logic
├── booking.repository.ts       # Database operations
├── dto/
│   └── create-booking.input.ts # Input validation
├── models/
│   └── booking.model.ts        # Sequelize model
└── documentation/
    ├── README.md               # This file
    └── booking-api.md          # Complete API documentation
```

## 🎯 Key Features

### **Relationship Management**
- **User ↔ Booking**: Many-to-One relationship
- **Hotel ↔ Booking**: Many-to-One relationship
- **Eager Loading**: Automatic inclusion of related data

### **Business Logic**
- **Date Validation**: Check-out must be after check-in
- **Overlap Prevention**: No duplicate bookings for same hotel/dates
- **Data Integrity**: Foreign key constraints

### **Performance**
- **Optimized Queries**: Efficient database operations
- **Relationship Loading**: Smart inclusion of related data
- **Pagination Support**: For large datasets

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

For questions about the booking module:
1. Check the [complete API documentation](./booking-api.md)
2. Test queries in [GraphQL Playground](http://localhost:3000/graphql)
3. Review error handling examples
4. Check business rules and constraints
