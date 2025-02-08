import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'node:process';
import { ValidationPipe } from '@nestjs/common';
import { appSetup } from './config/app.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  appSetup(app);
  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
