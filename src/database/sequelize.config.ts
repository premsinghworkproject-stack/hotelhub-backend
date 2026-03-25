import { ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { readdirSync } from 'fs';
import { join } from 'path';

// Auto-load all models from the models directory
const modelsPath = join(__dirname, 'models');
const modelFiles = readdirSync(modelsPath).filter(file => file.endsWith('.model.ts'));

// Dynamic import of all models
const models = modelFiles.map(file => {
  const modelName = file.replace('.model.ts', '');
  const modelPath = join(modelsPath, file);
  return require(modelPath)[modelName.charAt(0).toUpperCase() + modelName.slice(1)];
});

export const getDatabaseConfig = (configService: ConfigService): SequelizeModuleOptions => {
  const isDevelopment = configService.get<string>('NODE_ENV') === 'development';

  return {
    dialect: 'postgres',
    host: configService.get<string>('DB_HOST') || 'localhost',
    port: configService.get<number>('DB_PORT') || 5432,
    username: configService.get<string>('DB_USER') || 'postgres',
    password: configService.get<string>('DB_PASS') || 'password',
    database: configService.get<string>('DB_NAME') || 'booking_db',
    models: models,
    autoLoadModels: true,
    logging: isDevelopment,
    synchronize: false,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  };
};
