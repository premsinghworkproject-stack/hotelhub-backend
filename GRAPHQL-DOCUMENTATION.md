# GraphQL Documentation Guide

## 📚 GraphQL Documentation Options

Unlike REST APIs that use Swagger, GraphQL has several excellent documentation options:

## 🚀 **Available Documentation Tools**

### 1. **GraphQL Playground** (Built-in) - ✅ Already Enabled
- **URL**: `http://localhost:3000/graphql`
- **Features**: Interactive query builder, schema explorer, documentation sidebar
- **Usage**: Perfect for development and testing

### 2. **Apollo Sandbox** (Recommended)
- **URL**: `https://studio.apollographql.com/sandbox`
- **Features**: Enhanced UI, better schema exploration, query history
- **Usage**: Production-ready documentation tool

### 3. **GraphQL Schema Documentation** (Auto-generated)
- **File**: `src/schema.gql` (auto-generated)
- **Features**: Complete schema definition with types and descriptions

## 🎯 **How to Access Documentation**

### **Development Mode (Currently Running)**
```bash
npm run start:dev
```
Visit: `http://localhost:3000/graphql`

### **What You'll See**
1. **Schema Explorer**: Complete API schema on the left
2. **Query Builder**: Interactive query editor
3. **Documentation Panel**: Detailed field descriptions
4. **Real-time Results**: Test queries instantly

## 📖 **Enhanced Documentation Features**

### **Resolver Documentation**
Our resolvers now include:
- ✅ **JSDoc Comments**: Detailed method descriptions
- ✅ **GraphQL Descriptions**: Field-level documentation
- ✅ **Example Queries**: Ready-to-use GraphQL examples
- ✅ **Type Information**: Input/output type details

### **Example Documentation Structure**

#### **Booking Operations**
```graphql
# Create a new booking
mutation {
  createBooking(input: {
    userId: 1,
    hotelId: 1,
    checkIn: "2024-03-20",
    checkOut: "2024-03-23"
  }) {
    id
    userId
    hotelId
    checkIn
    checkOut
    user {
      id
      name
      email
    }
    hotel {
      id
      name
      location
      price
    }
  }
}

# Get booking by ID
query {
  booking(id: 1) {
    id
    userId
    hotelId
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

# Get all bookings for a user
query {
  bookingsByUser(userId: 1) {
    id
    hotelId
    checkIn
    checkOut
    hotel {
      name
      location
      price
    }
  }
}
```

## 🔧 **Advanced Documentation Features**

### **1. Schema Introspection**
GraphQL automatically generates documentation from your schema:
- Type definitions
- Field descriptions
- Input validation rules
- Relationship mappings

### **2. Type Safety**
- **Auto-completion**: IDE support for GraphQL queries
- **Type validation**: Runtime type checking
- **Error handling**: Detailed error messages

### **3. Interactive Testing**
- **Query builder**: Drag-and-drop interface
- **Variable support**: Test with different inputs
- **History tracking**: Save and reuse queries

## 📱 **Mobile & External Access**

### **Apollo Sandbox (External)**
1. Go to: `https://studio.apollographql.com/sandbox`
2. Enter your GraphQL endpoint: `http://localhost:3000/graphql`
3. Access enhanced documentation features

### **Postman GraphQL**
1. Create new GraphQL request
2. Set endpoint: `http://localhost:3000/graphql`
3. Use auto-generated schema documentation

## 🎨 **Best Practices for Documentation**

### **1. Descriptive Naming**
```typescript
@Query(() => Booking, { 
  name: 'booking',
  description: 'Get a specific booking by its ID'
})
```

### **2. Detailed Examples**
```typescript
/**
 * @example
 * ```graphql
 * query {
 *   booking(id: 1) {
 *     id
 *     userId
 *     hotelId
 *   }
 * }
 * ```
 */
```

### **3. Type Annotations**
```typescript
@Args('id', { type: () => Int }) id: number
```

## 🚀 **Next Steps**

1. **Start Development Server**: `npm run start:dev`
2. **Open GraphQL Playground**: `http://localhost:3000/graphql`
3. **Explore Schema**: Check the "DOCS" tab on the right
4. **Test Queries**: Use the provided examples
5. **Try Apollo Sandbox**: `https://studio.apollographql.com/sandbox`

## 📋 **Available Operations**

### **Users**
- `createUser` - Create new user
- `user` - Get user by ID
- `users` - Get all users

### **Hotels**
- `createHotel` - Create new hotel
- `hotel` - Get hotel by ID
- `hotels` - Get all hotels (with pagination)
- `searchHotels` - Search hotels by name

### **Bookings**
- `createBooking` - Create new booking
- `booking` - Get booking by ID
- `bookings` - Get all bookings
- `bookingsByUser` - Get bookings for user
- `bookingsByHotel` - Get bookings for hotel

## 🎯 **Why GraphQL Documentation is Better Than Swagger**

✅ **Self-documenting**: Schema IS the documentation  
✅ **Interactive**: Test queries directly in docs  
✅ **Type-safe**: Built-in validation and autocompletion  
✅ **Real-time**: Always up-to-date with code changes  
✅ **Relationships**: See data connections clearly  
✅ **No maintenance**: Auto-generated from code  

Your GraphQL API is now fully documented and ready for exploration! 🚀
