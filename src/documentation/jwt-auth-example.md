# JWT Authentication Implementation Example

## 📁 File Structure
```
src/
├── auth/
│   ├── decorators/
│   │   ├── auth-user.decorator.ts
│   │   └── roles.decorator.ts
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   ├── strategies/
│   │   └── jwt.strategy.ts
│   └── auth.module.ts
├── common/
│   └── filters/
│       └── graphql-exception.filter.ts
└── app.module.ts
```

## 🔐 JWT Authentication Example

### 1. Auth User Decorator
```typescript
// src/auth/decorators/auth-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const gqlCtx = GqlExecutionContext.create(ctx);
    const { req } = gqlCtx.getContext();
    return req.user;
  },
);
```

### 2. Roles Decorator
```typescript
// src/auth/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
```

### 3. JWT Auth Guard
```typescript
// src/auth/guards/jwt-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const gqlCtx = GqlExecutionContext.create(context);
    const { req } = gqlCtx.getContext();
    
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      throw new UnauthorizedException('Authentication required');
    }
    
    // Verify JWT token here
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
```

### 4. Roles Guard
```typescript
// src/auth/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const gqlCtx = GqlExecutionContext.create(context);
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    const { req } = gqlCtx.getContext();
    
    if (!requiredRoles) {
      return true;
    }
    
    const user = req.user;
    const hasRole = requiredRoles.some(role => user.roles?.includes(role));
    
    if (!hasRole) {
      throw new ForbiddenException(`Requires roles: ${requiredRoles.join(', ')}`);
    }
    
    return true;
  }
}
```

### 5. Updated Booking Resolver
```typescript
// src/modules/booking/booking.resolver.ts
import { Resolver, Mutation, Query, Args, Int, UseGuards } from '@nestjs/graphql';
import { Booking } from '../../database/models/booking.model';
import { BookingService } from './booking.service';
import { CreateBookingInput } from './dto/create-booking.input';
import { AuthUser } from '../../auth/decorators/auth-user.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';

@Resolver(() => Booking)
@UseGuards(JwtAuthGuard)
export class BookingResolver {
  constructor(private readonly bookingService: BookingService) {}

  @Mutation(() => Booking)
  @Roles('user') // Only authenticated users can create bookings
  async createBooking(
    @AuthUser() user: any,
    @Args('input') createBookingDto: CreateBookingInput
  ): Promise<Booking> {
    // User can only book for themselves
    if (createBookingDto.userId !== user.id) {
      throw new ForbiddenException('You can only create bookings for yourself');
    }
    
    return this.bookingService.create(createBookingDto);
  }

  @Query(() => Booking, { name: 'booking' })
  @Public() // Anyone can view booking details
  async getBookingById(@Args('id') id: number): Promise<Booking> {
    return this.bookingService.findById(id);
  }

  @Query(() => [Booking], { name: 'bookingsByUser' })
  @Roles('user', 'admin') // Users can see their own bookings, admins can see all
  async getBookingsByUser(
    @AuthUser() user: any,
    @Args('userId') userId: number
  ): Promise<Booking[]> {
    // Users can only see their own bookings unless they're admin
    if (user.roles?.includes('admin') || userId === user.id) {
      return this.bookingService.findByUserId(userId);
    } else {
      throw new ForbiddenException('You can only view your own bookings');
    }
  }

  @Query(() => [Booking], { name: 'bookingsByHotel' })
  @Roles('admin', 'hotel-manager') // Only admins and hotel managers can see hotel bookings
  async getBookingsByHotel(@Args('hotelId') hotelId: number): Promise<Booking[]> {
    return this.bookingService.findByHotelId(hotelId);
  }

  @Query(() => [Booking], { name: 'bookings' })
  @Roles('admin') // Only admins can see all bookings
  async getBookings(): Promise<Booking[]> {
    return this.bookingService.findAll();
  }
}
```

### 6. Updated App Module
```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/user/user.module';
import { HotelModule } from './modules/hotel/hotel.module';
import { BookingModule } from './modules/booking/booking.module';
import { join } from 'path';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLExceptionFilter } from './common/filters/graphql-exception.filter';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: process.env.NODE_ENV === 'development',
      introspection: process.env.NODE_ENV === 'development',
      context: ({ req }) => ({ req }),
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    HotelModule,
    BookingModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
```

## 🧪 GraphQL Testing with Auth

### Test Setup
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

  it('should require authentication for protected mutations', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation CreateBooking($input: CreateBookingInput!) {
            createBooking(input: $input) {
              id
              userId
            }
          }
        `,
        variables: {
          input: {
            userId: 1,
            hotelId: 1,
            checkIn: "2024-03-20",
            checkOut: "2024-03-23"
          }
        }
      })
      .expect(200);

    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toContain('Authentication required');
  });

  it('should allow authenticated users to create bookings', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation Login($email: String!, $password: String!) {
            login(email: $email, password: $password) {
              token
            }
          }
        `,
        variables: {
          email: "user@example.com",
          password: "password123"
        }
      })
      .expect(200);

    const token = loginResponse.body.data.login.token;

    const bookingResponse = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
          mutation CreateBooking($input: CreateBookingInput!) {
            createBooking(input: $input) {
              id
              userId
            }
          }
        `,
        variables: {
          input: {
            userId: 1,
            hotelId: 1,
            checkIn: "2024-03-20",
            checkOut: "2024-03-23"
          }
        }
      })
      .expect(200);

    expect(bookingResponse.body.errors).toBeUndefined();
    expect(bookingResponse.body.data.createBooking).toBeDefined();
  });
});
```

## 🎯 GraphQL Playground Testing

### 1. Login to Get Token
```graphql
mutation Login {
  login(email: "user@example.com", password: "password123") {
    token
    user {
      id
      name
      email
      roles
    }
  }
}
```

### 2. Set Authorization Header
In GraphQL Playground, set the following in the "HTTP HEADERS" section:
```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN_HERE"
}
```

### 3. Test Authenticated Queries
```graphql
mutation CreateBooking {
  createBooking(input: {
    userId: 1,
    hotelId: 1,
    checkIn: "2024-03-20",
    checkOut: "2024-03-23"
  }) {
    id
    userId
    hotelId
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

This example shows how JWT authentication works seamlessly with GraphQL queries and decorators! 🔐
