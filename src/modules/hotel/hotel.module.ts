import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Hotel } from '../../database/models/hotel.model';
import { HotelService } from './hotel.service';
import { HotelResolver } from './hotel.resolver';
import { HotelRepository } from './hotel.repository';

@Module({
  imports: [
    SequelizeModule.forFeature([Hotel]),
  ],
  providers: [HotelService, HotelResolver, HotelRepository],
  exports: [HotelService, HotelRepository],
})
export class HotelModule {}
