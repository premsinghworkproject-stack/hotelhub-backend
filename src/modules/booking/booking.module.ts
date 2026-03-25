import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Booking } from '../../database/models/booking.model';
import { BookingService } from './booking.service';
import { BookingResolver } from './booking.resolver';
import { BookingRepository } from './booking.repository';
import { UserModule } from '../user/user.module';
import { HotelModule } from '../hotel/hotel.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Booking]),
    UserModule,
    HotelModule,
  ],
  providers: [BookingService, BookingResolver, BookingRepository],
  exports: [BookingService, BookingRepository],
})
export class BookingModule {}
