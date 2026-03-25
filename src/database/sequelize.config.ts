import { ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';

// Import models directly for reliability
import { User } from './models/user.model';
import { Hotel } from './models/hotel.model';
import { RoomType } from './models/room-type.model';
import { Room } from './models/room.model';
import { Booking } from './models/booking.model';
import { OTP } from './models/otp.model';
import { HotelAmenity } from './models/hotel-amenity.model';
import { HotelImage } from './models/hotel-image.model';
import { RoomTypeAmenity } from './models/room-type-amenity.model';
import { RoomTypeImage } from './models/room-type-image.model';
import { Review } from './models/review.model';

export const getDatabaseConfig = (configService: ConfigService): SequelizeModuleOptions => {
  const isDevelopment = configService.get<string>('NODE_ENV') === 'development';

  return {
    dialect: 'postgres',
    host: configService.get<string>('DB_HOST') || 'localhost',
    port: configService.get<number>('DB_PORT') || 5432,
    username: configService.get<string>('DB_USER') || 'postgres',
    password: configService.get<string>('DB_PASS') || 'password',
    database: configService.get<string>('DB_NAME') || 'booking_db',
    models: [
      User,
      Hotel,
      RoomType,
      Room,
      Booking,
      OTP,
      HotelAmenity,
      HotelImage,
      RoomTypeAmenity,
      RoomTypeImage,
      Review,
    ],
    logging: isDevelopment ? console.log : false,
    autoLoadModels: false, // Disable auto-loading since we're manually importing
    synchronize: false, // Disable auto-sync - use manual migrations
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  };
};
