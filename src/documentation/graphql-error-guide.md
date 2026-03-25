# GraphQL Error Handling Guide

## 🚀 **GraphQL Error Handling in NestJS**

### **✅ How GraphQL Handles Errors**

GraphQL has a different error handling approach compared to REST APIs:

#### **✅ Always HTTP 200 Status**
```typescript
// GraphQL always returns HTTP 200, even for errors
{
  "data": null,
  "errors": [
    {
      "message": "User not found",
      "code": "NOT_FOUND",
      "locations": [{"line": 2, "column": 3}],
      "path": ["getUser"],
      "extensions": {
        "code": "NOT_FOUND",
        "field": "id"
      }
    }
  ]
}
```

#### **✅ Error Object Structure**
```typescript
{
  "message": "Error description",
  "code": "ERROR_CODE",
  "locations": [...],
  "path": [...],
  "extensions": {
    "code": "ERROR_CODE",
    "field": "fieldName",
    "additionalInfo": "..."
  }
}
```

### **✅ Best Practices for GraphQL Errors**

#### **✅ Use GraphQLError Class**
```typescript
import { GraphQLError } from 'graphql';

// In your services
throw new GraphQLError('User not found', {
  extensions: {
    code: 'NOT_FOUND',
    field: 'id'
  }
});
```

#### **✅ Consistent Error Codes**
```typescript
// Common error codes
export enum ErrorCodes {
  BAD_REQUEST = 'BAD_REQUEST',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  CONFLICT = 'CONFLICT',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  OTP_EXPIRED = 'OTP_EXPIRED',
  INVALID_OTP = 'INVALID_OTP'
}
```

### **✅ Why No Exception Filters?**

#### **✅ GraphQL Has Built-in Error Handling**
- **HTTP Status**: Always 200 (by GraphQL spec)
- **Error Structure**: Standardized error objects
- **Error Propagation**: Built into GraphQL execution
- **Format Error**: Customizable via `formatError` function

#### **✅ Exception Filters Don't Work Well**
- **Status Codes**: Can't change HTTP status codes
- **Error Format**: GraphQL controls response format
- **Execution Flow**: GraphQL handles errors differently
- **Best Practice**: Use `GraphQLError` and `formatError`

### **✅ Current Error Handling Setup**

#### **✅ What We Have**
```typescript
// 1. GraphQLError for throwing errors
throw new GraphQLError('Message', { extensions: { code: 'CODE' } });

// 2. Global error formatting
formatError: (error) => ({
  message: error.message,
  code: error.extensions?.code,
  extensions: error.extensions
});

// 3. Validation pipe for input validation
app.useGlobalPipes(new ValidationPipe());
```

#### **✅ What We Removed**
- ❌ Exception filters (don't work with GraphQL)
- ❌ HTTP status code manipulation (GraphQL controls this)
- ❌ Custom error middleware (interferes with GraphQL)

**This GraphQL error handling approach is the recommended pattern for NestJS GraphQL applications!** 🚀
