import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';
import request from 'supertest';
import { createTestingApp } from '../create-testing-app';

describe('Game integration tests', () => {
  let app: INestApplication<App>;
  let moduleFixture: TestingModule;
  let dataSource: DataSource;

  const testUsers = [
    { username: 'user1', password: 'password1', email: 'user1@example.com' },
    { username: 'user2', password: 'password2', email: 'user2@example.com' },
  ];
  const authTokens = { user1: '', user2: '' };
  const userIds = { user1: 0, user2: 0 };
  beforeAll(async () => {
    [app, moduleFixture] = await createTestingApp();
    dataSource = moduleFixture.get<DataSource>(getDataSourceToken());

    await dataSource.query(
      `TRUNCATE TABLE "question" RESTART IDENTITY CASCADE;
      TRUNCATE TABLE "game" RESTART IDENTITY CASCADE;
      TRUNCATE TABLE "game_question" RESTART IDENTITY CASCADE;
      TRUNCATE TABLE "player" RESTART IDENTITY CASCADE;
      TRUNCATE TABLE "game_answer" RESTART IDENTITY CASCADE;`,
    );
  });
  afterAll(async () => {
    await app.close();
  });
  it('test', async () => {
    await request(app.getHttpServer()).get('sa/quiz/questions');
  });
});
