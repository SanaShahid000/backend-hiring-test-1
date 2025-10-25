import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { MongoExceptionFilter } from './filters/mongo-exception.filter';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Error filter
  app.useGlobalFilters(new MongoExceptionFilter());

  // CORS
  app.enableCors({ origin: true, credentials: true });

  // Swagger docs
  const config = new DocumentBuilder()
    .setTitle('NestJS Task API')
    .setDescription('Users endpoints')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(express.urlencoded({ extended: false })); // Parse Twilio form POSTs

  await app.listen(3000);
}
bootstrap();
