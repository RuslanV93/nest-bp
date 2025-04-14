import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class DropSqlRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}
  async deleteAllData() {
    await this.dataSource.query(`
    BEGIN;

   
      
      TRUNCATE TABLE "blog" CASCADE;
      TRUNCATE TABLE "post" CASCADE;
      TRUNCATE TABLE "like_dislike" CASCADE;
      TRUNCATE TABLE "device" CASCADE;
      TRUNCATE TABLE "password_info" CASCADE;
      TRUNCATE TABLE "email_info" CASCADE;
      TRUNCATE TABLE "user" CASCADE;
      TRUNCATE TABLE "comment" CASCADE;



      COMMIT;

      
    `);
  }
}
