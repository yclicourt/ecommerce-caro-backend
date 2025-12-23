import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { config } from './config/swagger.config';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  // Constant to handle different origins
  const allowedOrigins = [
    process.env.ORIGIN_CLIENT_PRODUCTION?.replace(/\/$/, ''),
    process.env.ORIGIN_CLIENT_DEVELOPMENT?.replace(/\/$/, ''),
  ].filter(Boolean); // Filter out any undefined or empty strings

  // Configuration app
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(process.env.PORT ?? 4000);

  // Enable CORS
  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // Permit requests without origin (like Postman or curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.error('CORS Blocked:', origin);
        return callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Serve static files
  app.use('/api/v1/uploads', express.static(join(process.cwd(), 'uploads')));

  // Swagger
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/v1/docs', app, documentFactory);
  await app.listen(process.env.PORT ?? 4001);
}

void bootstrap();
