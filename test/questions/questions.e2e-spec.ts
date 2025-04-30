import * as dotenv from 'dotenv';
dotenv.config();
import { createTestingApp } from '../create-testing-app';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { TestingModule } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import { questionCase1, questionCase2, questionCase3 } from './question-data';
import { QuestionViewDto } from '../../src/modules/quiz-game/question/interfaces/dto/question.view-dto';
import { App } from 'supertest/types';
import { PaginatedViewDto } from '../../src/core/dto/base.paginated.view-dto';

describe('Questions e2e tests', () => {
  let app: INestApplication<App>;
  let moduleFixture: TestingModule;
  let dataSource: DataSource;
  beforeAll(async () => {
    [app, moduleFixture] = await createTestingApp();
    dataSource = moduleFixture.get<DataSource>(getDataSourceToken());

    await dataSource.query(
      `TRUNCATE TABLE "question" RESTART IDENTITY CASCADE;`,
    );
  });
  afterAll(async () => {
    await app.close();
  });

  it('creates new question', async () => {
    await request(app.getHttpServer())
      .post('/sa/quiz/questions')
      .auth('admin', 'qwerty')
      .send(questionCase1)
      .expect(201)
      .expect((res) => {
        const body = res.body as QuestionViewDto;
        expect(body.body).toBe(questionCase1.body);
        expect(body.correctAnswers).toEqual(
          expect.arrayContaining(questionCase1.correctAnswers),
        );
        expect(body.published).toBe(false);
      });
  });
  it('should return all tests', async () => {
    const questions = await request(app.getHttpServer())
      .get('/sa/quiz/questions')
      .expect(200);
    console.log(questions.body);
  });
  it('updates test fields, and get updated', async () => {
    const questions = (
      await request(app.getHttpServer()).get('/sa/quiz/questions')
    ).body as PaginatedViewDto<QuestionViewDto[]>;
    expect(Array.isArray(questions.items)).toBe(true);
    const questionId = questions.items[0].id;
    await request(app.getHttpServer())
      .put(`/sa/quiz/questions/${questionId}`)
      .auth('admin', 'qwerty')
      .send(questionCase2)
      .expect(204);

    await request(app.getHttpServer())
      .get('/sa/quiz/questions')
      .expect((res) => {
        const questions = res.body as PaginatedViewDto<QuestionViewDto[]>;
        expect(questions.items[0].body).toBe(questionCase2.body);
        expect(questions.items[0].correctAnswers).toEqual(
          expect.arrayContaining(questionCase2.correctAnswers),
        );
        expect(questions.items[0].published).toBe(false);
      });
  });

  it('updates published field, and get updated', async () => {
    const id = 1;
    await request(app.getHttpServer())
      .put(`/sa/quiz/questions/${id}/publish`)
      .auth('admin', 'qwerty')
      .send({
        published: true,
      })
      .expect(204);
    await request(app.getHttpServer())
      .get('/sa/quiz/questions')
      .expect(200)
      .expect((res) => {
        const questions = res.body as PaginatedViewDto<QuestionViewDto[]>;
        expect(questions.items[0].published).toBe(true);
      });
  });
  it('delete question by id', async () => {
    const id = 2;
    await request(app.getHttpServer())
      .post('/sa/quiz/questions')
      .auth('admin', 'qwerty')
      .send(questionCase3)
      .expect(201)
      .expect((res) => {
        const body = res.body as QuestionViewDto;
        expect(body.body).toBe(questionCase3.body);
        expect(body.correctAnswers).toEqual(
          expect.arrayContaining(questionCase3.correctAnswers),
        );
        expect(body.published).toBe(false);
      });
    await request(app.getHttpServer())
      .delete(`/sa/quiz/questions/${id}`)
      .auth('admin', 'qwerty')
      .expect(204);
    await request(app.getHttpServer())
      .get('/sa/quiz/questions')
      .auth('admin', 'qwerty')
      .expect(200)
      .expect((res) => {
        const questions = res.body as PaginatedViewDto<QuestionViewDto[]>;
        expect(questions.items.length).toBe(1);
      });
  });
});
