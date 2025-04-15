import * as dotenv from 'dotenv';
dotenv.config();
import { createTestingApp } from '../create-testing-app';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import request from 'supertest';

describe('Blogs e2e tests', () => {
  let app: INestApplication<App>;
  beforeAll(async () => {
    app = await createTestingApp();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should return all blogs', async () => {
    const response = await request(app.getHttpServer()).get('/blogs');
    console.log(response.body);
    console.log('URL запроса:', response.request.url);
  });
});
