import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class DropSqlRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}
  async deleteAllData() {
    await this.dataSource.query(`
    BEGIN;

   
      
      TRUNCATE TABLE "blog" RESTART IDENTITY CASCADE;
      TRUNCATE TABLE "post" RESTART IDENTITY CASCADE;
      TRUNCATE TABLE "like_dislike" RESTART IDENTITY CASCADE;
      TRUNCATE TABLE "device" RESTART IDENTITY CASCADE;
      TRUNCATE TABLE "password_info" RESTART IDENTITY CASCADE;
      TRUNCATE TABLE "email_info" RESTART IDENTITY CASCADE;
      TRUNCATE TABLE "user" RESTART IDENTITY CASCADE;
      TRUNCATE TABLE "comment" RESTART IDENTITY CASCADE;
      TRUNCATE TABLE "game" RESTART IDENTITY CASCADE;
      TRUNCATE TABLE "game_question" RESTART IDENTITY CASCADE;
      TRUNCATE TABLE "player" RESTART IDENTITY CASCADE;
      TRUNCATE TABLE "game_answer" RESTART IDENTITY CASCADE;
      TRUNCATE TABLE "question" RESTART IDENTITY CASCADE;
      
      




      COMMIT;

      
    `);
  }
}
