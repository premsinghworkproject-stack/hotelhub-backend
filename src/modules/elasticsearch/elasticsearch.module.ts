import { Module, Global } from '@nestjs/common';
import { ElasticsearchService } from './elasticsearch.service';
import { ElasticsearchSyncService } from './elasticsearch-sync.service';
import { ElasticsearchController } from './elasticsearch.controller';
import { ElasticsearchResolver } from './elasticsearch.resolver';
import { ScheduleModule } from '@nestjs/schedule';
import { HotelModule } from '../hotel/hotel.module';

@Global()
@Module({
  imports: [
    ScheduleModule.forRoot(),
    HotelModule,
  ],
  controllers: [ElasticsearchController],
  providers: [ElasticsearchService, ElasticsearchSyncService, ElasticsearchResolver],
  exports: [ElasticsearchService, ElasticsearchSyncService],
})
export class ElasticsearchModule {}
