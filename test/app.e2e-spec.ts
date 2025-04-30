import * as dotenv from 'dotenv';
dotenv.config();

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { CoreConfig } from '../src/core/core-config/core.config';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const testingModuleBuilder = Test.createTestingModule({
      imports: [
        await ConfigModule.forRoot({
          envFilePath: [
            join(__dirname, '../src/env', `.env.${process.env.NODE_ENV}.local`),
            join(__dirname, '../src/env', `.env.${process.env.NODE_ENV}`),
            join(__dirname, '../src/env', '.env.production'),
          ],
          isGlobal: true,
        }),
        AppModule,
      ],
      providers: [CoreConfig],
    });
    const moduleFixture: TestingModule = await testingModuleBuilder.compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', async () => {
    await request(app.getHttpServer()).get('/').expect(200);
  });
});
