import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/user/user.module';
import { HotelModule } from './modules/hotel/hotel.module';
import { BookingModule } from './modules/booking/booking.module';
import { AuthModule } from './modules/auth/auth.module';
import { join } from 'path';
import { AppController } from './app.controller';

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
      formatError: (error) => ({
        message: error.message,
        code: error.extensions?.code,
      }),
      path: '/graphql', // Serve GraphQL on root path
    }),
    DatabaseModule,
    UserModule,
    HotelModule,
    BookingModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule { }
