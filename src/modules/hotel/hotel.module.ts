import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Hotel } from '../../database/models/hotel.model';
import { HotelService } from './hotel.service';
import { HotelResolver } from './hotel.resolver';
import { HotelRepository } from './hotel.repository';
import { ElasticsearchModule } from '../elasticsearch/elasticsearch.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Hotel]),
    ElasticsearchModule,
  ],
  providers: [HotelService, HotelResolver, HotelRepository],
  exports: [HotelService, HotelRepository],
})
export class HotelModule {}
