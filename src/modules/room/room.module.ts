import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Room } from '../../database/models/room.model';
import { RoomImage } from '../../database/models/room-image.model';
import { RoomService } from './room.service';
import { RoomResolver } from './room.resolver';
import { RoomRepository } from './room.repository';
import { RoomWithImagesService } from './room-with-images.service';
import { RoomWithImagesResolver } from './room-with-images.resolver';
import { CommonModule } from '../../common/common.module';
import { HotelModule } from '../hotel/hotel.module';
import { RoomTypeModule } from '../room-type/room-type.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Room, RoomImage]),
    CommonModule,
    forwardRef(() => HotelModule),
    forwardRef(() => RoomTypeModule),
  ],
  providers: [
    RoomService, 
    RoomResolver, 
    RoomRepository,
    RoomWithImagesService,
    RoomWithImagesResolver,
  ],
  exports: [RoomService, RoomRepository, RoomWithImagesService],
})
export class RoomModule {}
