import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Hotel } from '../../database/models/hotel.model';
import { HotelImage } from '../../database/models/hotel-image.model';
import { HotelService } from './hotel.service';
import { HotelResolver } from './hotel.resolver';
import { HotelRepository } from './hotel.repository';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Hotel, HotelImage]),
    CommonModule,
  ],
  providers: [
    HotelService, 
    HotelResolver, 
    HotelRepository,
  ],
  exports: [HotelService, HotelRepository],
})
export class HotelModule {}
