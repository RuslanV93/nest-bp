import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class DropSqlRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}
  async deleteAllData() {
    await this.dataSource.query(`
    BEGIN;

      --TRUNCATE TABLE "POST_LIKES" CASCADE;
      --TRUNCATE TABLE "POSTS" CASCADE;
      --TRUNCATE TABLE "BLOGS" CASCADE;

      
      TRUNCATE TABLE "device" CASCADE;
      TRUNCATE TABLE "password_info" CASCADE;
      TRUNCATE TABLE "email_info" CASCADE;
      TRUNCATE TABLE "user" CASCADE;



      COMMIT;

      
    `);
  }
}
