import { ConfigService } from '@nestjs/config';
import * as cors from 'cors';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  const corsOrigins = configService.get<string>('CORS_ORIGINS').split(',');

  app.use(
    cors({
      origin: corsOrigins,
      credentials: true,
    }),
  );

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API for managing shoe sales')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  // Serve static files from the "public" directory
  app.use('/uploads', express.static(join(__dirname, '..', 'public/uploads')));

  await app.listen(configService.get<number>('PORT') || 5000);
}

bootstrap();
