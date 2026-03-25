# GraphQL Authentication & Authorization Guide

## 🔐 Authentication in GraphQL

GraphQL doesn't have built-in authentication like REST APIs, but NestJS provides excellent decorators and guards that work seamlessly with GraphQL.

## 🛠️ Authentication Decorators

### `@Public()`
Makes a GraphQL query/mutation accessible without authentication.

```typescript
import { Public } from '@nestjs/common';

@Resolver(() => User)
export class UserResolver {
  @Query(() => [User])
  @Public() // This query can be accessed without authentication
  async getPublicUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Query(() => User)
  async getPrivateUsers(@AuthUser() user: User): Promise<User[]> {
    // This query requires authentication
    return this.userService.findAll();
  }
}
```

### `@AuthUser()`
Injects the authenticated user into the resolver method.

```typescript
import { AuthUser } from '../auth/decorators/auth-user.decorator';

@Resolver(() => Booking)
export class BookingResolver {
  @Query(() => [Booking])
  async getUserBookings(@AuthUser() user: User): Promise<Booking[]> {
    // user object contains authenticated user data
    return this.bookingService.findByUserId(user.id);
  }
}
```

### `@Roles()`
Role-based authorization for GraphQL operations.

```typescript
import { Roles } from '../auth/decorators/roles.decorator';

@Resolver(() => Hotel)
export class HotelResolver {
  @Mutation(() => Hotel)
  @Roles('admin', 'hotel-manager') // Only admin and hotel-manager can create hotels
  async createHotel(@AuthUser() user: User): Promise<Hotel> {
    return this.hotelService.create(hotelData);
  }

  @Query(() => [Hotel])
  @Public() // Anyone can view hotels
  async getHotels(): Promise<Hotel[]> {
    return this.hotelService.findAll();
  }
}
```

## 🛡️ Custom Auth Decorators

### Create Auth User Decorator
```typescript
// src/auth/decorators/auth-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user; // Assumes user is attached by auth guard
  },
);
```

### Create Roles Decorator
```typescript
// src/auth/decorators/roles.decorator.ts
import { SetMetadata, createParamDecorator } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles, target, propertyKey, descriptor);
```

## 🛡️ Authentication Guards

### JWT Guard
```typescript
// src/auth/guards/jwt-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    
    if (!req.user) {
      throw new UnauthorizedException('Authentication required');
    }
    
    return true;
  }
}
```

### Roles Guard
```typescript
// src/auth/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    const { req } = ctx.getContext();
    
    if (!requiredRoles) {
      return true;
    }
    
    const user = req.user;
    const hasRole = requiredRoles.some(role => user.roles?.includes(role));
    
    if (!hasRole) {
      throw new ForbiddenException('Insufficient permissions');
    }
    
    return true;
  }
}
```

## 🔧 Applying Auth to GraphQL

### Module Configuration
```typescript
// src/app.module.ts
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
```

### Resolver with Authentication
```typescript
@Resolver(() => Booking)
@UseGuards(JwtAuthGuard) // Apply authentication globally
export class BookingResolver {
  @Query(() => [Booking])
  @Public() // Override for specific queries
  async getPublicBookings(): Promise<Booking[]> {
    return this.bookingService.findAll();
  }

  @Query(() => [Booking])
  async getUserBookings(@AuthUser() user: User): Promise<Booking[]> {
    // Requires authentication
    return this.bookingService.findByUserId(user.id);
  }
}
```

### Resolver with Roles
```typescript
@Resolver(() => Hotel)
@UseGuards(JwtAuthGuard, RolesGuard)
export class HotelResolver {
  @Mutation(() => Hotel)
  @Roles('admin') // Only admins can create hotels
  async createHotel(@AuthUser() user: User): Promise<Hotel> {
    return this.hotelService.create(hotelData);
  }

  @Query(() => [Hotel])
  @Roles('user', 'admin') // Users and admins can view hotels
  async getHotels(): Promise<Hotel[]> {
    return this.hotelService.findAll();
  }
}
```

## 🧪 GraphQL Auth Testing

### Testing with Authentication
```graphql
# First, login to get token
mutation Login {
  login(email: "user@example.com", password: "password") {
    token
    user {
      id
      name
      email
      roles
    }
  }
}

# Then use token in subsequent requests
query GetUserBookings($token: String!) {
  getUserBookings(token: $token) {
    id
    userId
    hotelId
    checkIn
    checkOut
  }
}
```

### Testing with Roles
```graphql
# Admin-only operation
mutation CreateHotel($token: String!) {
  createHotel(token: $token, input: {
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

# Public operation (no auth required)
query GetHotels {
  hotels {
    id
    name
    location
    price
  }
}
```

## 🎯 GraphQL Context

### Context with Auth
```typescript
// src/app.module.ts
GraphQLModule.forRoot<ApolloDriverConfig>({
  driver: ApolloDriver,
  autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
  playground: process.env.NODE_ENV === 'development',
  context: ({ req }) => {
    // Add user to context if authenticated
    return {
      req,
      user: req.user, // Set by auth guard
      headers: req.headers,
    };
  },
}),
```

### Accessing Context in Resolvers
```typescript
@Resolver(() => Booking)
export class BookingResolver {
  constructor(private readonly bookingService: BookingService) {}

  @Query(() => Booking)
  async getBooking(
    @Args('id') id: number,
    @Context() context: any // Access GraphQL context
  ): Promise<Booking> {
    const user = context.user; // Get authenticated user
    const headers = context.headers; // Access headers
    
    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }
    
    return this.bookingService.findById(id);
  }
}
```

## 🔐 JWT Integration

### JWT Strategy
```typescript
// src/auth/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return { 
      userId: payload.sub, 
      email: payload.email, 
      roles: payload.roles 
    };
  }
}
```

## 🧪 Testing Authentication

### Unit Test for Auth Decorator
```typescript
// tests/auth/auth-user.decorator.spec.ts
import { AuthUser } from '../decorators/auth-user.decorator';

describe('AuthUser Decorator', () => {
  it('should extract user from request', () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({ user: { id: 1, email: 'test@example.com' } })
      })
    };
    
    const user = AuthUser(null, mockContext);
    expect(user).toEqual({ id: 1, email: 'test@example.com' });
  });
});
```

### Integration Test for GraphQL Auth
```typescript
// tests/auth/graphql-auth.e2e.spec.ts
import { Test } from '@nestjs/testing';
import { GraphQLModule } from '@nestjs/graphql';
import { AppModule } from '../src/app.module';

describe('GraphQL Authentication', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it('should require authentication for protected queries', async () => {
    // Test without token
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query GetUserBookings {
            getUserBookings {
              id
              userId
            }
          }
        `
      })
      .expect(200);

    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toContain('Authentication required');
  });

  it('should allow authenticated requests', async () => {
    // Test with valid token
    const token = 'valid-jwt-token';
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
          query GetUserBookings {
            getUserBookings {
              id
              userId
            }
          }
        `
      })
      .expect(200);

    expect(response.body.errors).toBeUndefined();
    expect(response.body.data.getUserBookings).toBeDefined();
  });
});
```

## 🎯 GraphQL Playground with Auth

### Setting Headers in Playground
```graphql
# In GraphQL Playground headers section:
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

### Testing Authenticated Queries
```graphql
# With authentication header set:
query {
  getUserBookings {
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
```

## 🚀 Best Practices

### 1. **Layered Security**
- **Guards**: Authentication and authorization
- **Decorators**: Clean access to user data
- **Context**: Secure data passing

### 2. **GraphQL-Specific**
- **GqlExecutionContext**: Use GraphQL context
- **Error Handling**: GraphQL-formatted errors
- **Field-Level Security**: Apply per-operation auth

### 3. **Token Management**
- **JWT**: Stateless authentication
- **Refresh Tokens**: Handle token expiration
- **Revocation**: Token blacklist support

### 4. **Testing Strategy**
- **Unit Tests**: Decorators and guards
- **Integration Tests**: Full GraphQL flow
- **E2E Tests**: End-to-end authentication

## 📋 Implementation Checklist

### 🔐 Authentication Setup
- [ ] JWT strategy configured
- [ ] Auth guards implemented
- [ ] Context with user data
- [ ] Error handling for auth failures

### 🛡️ Authorization Setup
- [ ] Roles decorator created
- [ ] Role-based guards
- [ ] Field-level authorization
- [ ] Permission checking

### 🧪 Testing Setup
- [ ] Unit tests for decorators
- [ ] Integration tests for GraphQL auth
- [ ] E2E tests for complete flow
- [ ] Playground testing documented

## 🎮 GraphQL Playground Auth Examples

### **Login Mutation**
```graphql
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      id
      name
      email
      roles
    }
  }
}

# Variables
{
  "email": "admin@example.com",
  "password": "password123"
}
```

### **Authenticated Query**
```graphql
# Set Authorization header: Bearer YOUR_TOKEN
query GetUserBookings {
  getUserBookings {
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
```

### **Role-Based Mutation**
```graphql
# Requires admin role
mutation CreateHotel($input: HotelInput!) {
  createHotel(input: $input) {
    id
    name
    location
    price
  }
}

# Variables
{
  "input": {
    "name": "Luxury Resort",
    "location": "Miami, FL",
    "price": 450.00
  }
}
```

This comprehensive guide covers authentication and authorization in GraphQL with NestJS! 🔐
