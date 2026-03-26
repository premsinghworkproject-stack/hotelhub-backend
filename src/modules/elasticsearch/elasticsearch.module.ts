import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchService } from './elasticsearch.service';
import { Client } from '@elastic/elasticsearch';

export const ELASTICSEARCH_CLIENT = 'ELASTICSEARCH_CLIENT';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: ELASTICSEARCH_CLIENT,
      useFactory: async (configService: ConfigService) => {
        return new Client({
          node: configService.get('ELASTICSEARCH_NODE') || 'http://localhost:9200',
          auth: configService.get('ELASTICSEARCH_USERNAME') ? 
            { username: configService.get('ELASTICSEARCH_USERNAME'), password: configService.get('ELASTICSEARCH_PASSWORD') } : 
            undefined,
          maxRetries: 3,
          requestTimeout: 30000,
          pingTimeout: 3000,
        });
      },
      inject: [ConfigService],
    },
    ElasticsearchService,
  ],
  exports: [ElasticsearchService, ELASTICSEARCH_CLIENT],
})
export class ElasticsearchModule {}
