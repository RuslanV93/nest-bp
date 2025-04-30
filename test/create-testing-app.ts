// test/create-testing-app.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { App } from 'supertest/types';

export const createTestingApp = async (): Promise<
  [INestApplication<App>, TestingModule]
> => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        envFilePath: [
          join(__dirname, '../src/env', `.env.${process.env.NODE_ENV}.local`),
          join(__dirname, '../src/env', `.env.${process.env.NODE_ENV}`),
          join(__dirname, '../src/env', '.env.production'),
        ],
        isGlobal: true,
      }),
      AppModule,
    ],
  }).compile();

  const app = moduleFixture.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Это важно для трансформации DTO
      whitelist: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  await app.init();
  return [app, moduleFixture];
};
