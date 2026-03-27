import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/user/user.module';
import { HotelModule } from './modules/hotel/hotel.module';
import { BookingModule } from './modules/booking/booking.module';
import { AuthModule } from './modules/auth/auth.module';
import { ElasticsearchModule } from './modules/elasticsearch/elasticsearch.module';
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
      path: '/graphql',
      plugins: [], // Remove deprecated playground plugin
      csrfPrevention: process.env.NODE_ENV === 'development', // Disable CSRF prevention for development
      cache: 'bounded',
    }),
    DatabaseModule,
    ElasticsearchModule,
    HotelModule,
    UserModule,
    BookingModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule { }
