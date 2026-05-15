import { NestFactory } from '@nestjs/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { MulterError } from 'multer';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const uploadsPath = join(process.cwd(), 'uploads', 'products');
  if (!existsSync(uploadsPath)) {
    mkdirSync(uploadsPath, { recursive: true });
  }
  app.setGlobalPrefix('api');
  app.enableCors({ origin: true, credentials: true });
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));
  app.use((err: unknown, _req: Request, res: Response, next: NextFunction) => {
    if (err instanceof MulterError) {
      const message =
        err.code === 'LIMIT_FILE_SIZE'
          ? 'Image too large. Maximum size is 5MB per file.'
          : err.code === 'LIMIT_FILE_COUNT'
            ? 'Too many files. Maximum is 10 images.'
            : err.message;
      return res.status(400).json({ statusCode: 400, message });
    }
    if (err instanceof BadRequestException) {
      const response = err.getResponse();
      const message = typeof response === 'string' ? response : (response as { message?: string }).message;
      return res.status(400).json({ statusCode: 400, message: message ?? 'Bad request' });
    }
    if (err instanceof Error && /invalid file type|image files/i.test(err.message)) {
      return res.status(400).json({ statusCode: 400, message: err.message });
    }
    return next(err);
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('F-Commerce Toolkit API')
    .setDescription('API for Facebook seller order operations')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('auth')
    .addTag('businesses')
    .addTag('products')
    .addTag('orders')
    .addTag('quick-replies')
    .addTag('store')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
