import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class DropSqlRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}
  async deleteAllData() {
    await this.dataSource.query(`
    
    SET session_replication_role = 'replica';

    TRUNCATE TABLE "DEVICES" CASCADE;
    TRUNCATE TABLE "PASSWORD_INFO" CASCADE;
    TRUNCATE TABLE "EMAIL_CONFIRMATION_INFO" CASCADE;
    TRUNCATE TABLE "USERS" CASCADE;


    ALTER SEQUENCE "EMAIL_CONFIRMATION_INFO_id_seq" RESTART WITH 1;
    ALTER SEQUENCE "PASSWORD_INFO_id_seq" RESTART WITH 1;

    SET session_replication_role = 'origin';
    `);
  }
}
