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

  const corsOrigins = configService.get<string>('CORS_ORIGINS')?.split(',') || [];

  app.use(
    cors({
      origin: corsOrigins,
      credentials: true,
    }),
  );

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('CHU Andrainjato API')
    .setDescription('API for managing the CHU Andrainjato') // More descriptive
    .setVersion('1.0')
    .addBearerAuth()
    .addServer(configService.get<string>('APP_URL') || `http://localhost:${configService.get<number>('PORT') || 5000}`)
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  // Serve static files from the "public" directory
  app.use('/uploads', express.static(join(__dirname, '..', 'public/uploads')));

  const port = configService.get<number>('PORT') || 5000;
  await app.listen(port);

  const appUrl = configService.get<string>('APP_URL') || `http://localhost:${port}`;
  console.log(`Application is running on: ${appUrl}`);
}

bootstrap();