# User Module Documentation Index

## 📚 Available Documentation

### 📖 [User API Documentation](./user-api.md)
Complete reference for all user operations including:
- **Mutations**: `createUser`
- **Queries**: `user`, `users`
- **Data Types**: User model, CreateUserInput
- **Examples**: Complete GraphQL queries with responses
- **Error Handling**: All possible error scenarios
- **Business Rules**: Email uniqueness and validation

## 🚀 Quick Links

### **Common Operations**
- [Create User](./user-api.md#createuser) - Register a new user
- [Get User](./user-api.md#user) - Retrieve user details
- [All Users](./user-api.md#users) - Get user directory

### **Testing & Development**
- [GraphQL Playground](http://localhost:3000/graphql) - Interactive testing
- [Complete Examples](./user-api.md#usage-examples) - Ready-to-use queries
- [Error Handling](./user-api.md#error-handling) - Common error scenarios

## 📋 Module Structure

```
src/modules/user/
├── user.module.ts          # Module definition
├── user.resolver.ts         # GraphQL resolvers with documentation
├── user.service.ts          # Business logic
├── user.repository.ts       # Database operations
├── dto/
│   └── create-user.input.ts # Input validation
├── models/
│   └── user.model.ts        # Sequelize model
└── documentation/
    ├── README.md           # This file
    └── user-api.md         # Complete API documentation
```

## 🎯 Key Features

### **User Management**
- **Registration**: Create new users with validation
- **Profile Retrieval**: Get user details with relationships
- **User Directory**: List all users in the system

### **Data Integrity**
- **Email Uniqueness**: Each email can only be used once
- **Input Validation**: Comprehensive data validation
- **Relationship Loading**: Automatic inclusion of user bookings

### **Security**
- **Email Validation**: Proper email format checking
- **Data Sanitization**: Input sanitization and validation
- **Error Handling**: Secure error responses

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

For questions about the user module:
1. Check the [complete API documentation](./user-api.md)
2. Test queries in [GraphQL Playground](http://localhost:3000/graphql)
3. Review error handling examples
4. Check business rules and constraints
