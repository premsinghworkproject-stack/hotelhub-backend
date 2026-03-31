import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RoomType } from '../../database/models/room-type.model';
import { RoomTypeImage } from '../../database/models/room-type-image.model';
import { RoomTypeService } from './room-type.service';
import { RoomTypeResolver } from './room-type.resolver';
import { RoomTypeRepository } from './room-type.repository';
import { RoomTypeWithImagesService } from './room-type-with-images.service';
import { RoomTypeWithImagesResolver } from './room-type-with-images.resolver';
import { CommonModule } from '../../common/common.module';
import { HotelModule } from '../hotel/hotel.module';

@Module({
  imports: [
    SequelizeModule.forFeature([RoomType, RoomTypeImage]),
    CommonModule,
    forwardRef(() => HotelModule),
  ],
  providers: [
    RoomTypeService, 
    RoomTypeResolver, 
    RoomTypeRepository,
    RoomTypeWithImagesService,
    RoomTypeWithImagesResolver,
  ],
  exports: [RoomTypeService, RoomTypeRepository, RoomTypeWithImagesService],
})
export class RoomTypeModule {}
