import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { getDatabaseConfig } from './sequelize.config';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [],
      useFactory: (configService: ConfigService) => getDatabaseConfig(configService),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
