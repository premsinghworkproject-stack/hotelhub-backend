import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (validationErrors) => {
        console.error('Validation errors:', validationErrors);
        return {
          errors: validationErrors,
          message: 'Validation failed',
          code: 'VALIDATION_ERROR'
        };
      }
    }),
  );

  app.enableCors({
    origin: ['http://localhost:3000'], // Next.js
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Swagger documentation (only in development)
  if (configService.get<string>('NODE_ENV') === 'development') {
    const config = new DocumentBuilder()
      .setTitle('Hotel Booking API')
      .setDescription('A production-ready hotel booking system with GraphQL')
      .setVersion('1.0')
      .addTag('hotels')
      .addTag('users')
      .addTag('bookings')
      .addTag('auth')
      .addBearerAuth()
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully');
    await app.close();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully');
    await app.close();
    process.exit(0);
  });

  const port = configService.get<number>('PORT') || 8200;
  const host = configService.get<string>('HOST') || 'localhost';
  
  await app.listen(port, host);
  
  console.log(`🚀 Application is running on: http://${host}:${port}`);
  console.log(`📚 GraphQL Playground: http://${host}:${port}/graphql`);
  
  if (configService.get<string>('NODE_ENV') === 'development') {
    console.log(`📖 Swagger Documentation: http://${host}:${port}/docs`);
  }
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
