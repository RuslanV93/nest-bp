import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ObjectId } from 'mongodb';
import { MeViewDto } from '../../users/interfaces/dto/userViewDto';

export type MeType = {
  _id: string;
  email: string;
  login: string;
};
@Injectable()
export class AuthSqlQueryRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}
  async getMe(userId: ObjectId) {
    const me: MeType[] = await this.dataSource.query(
      `
            SELECT u._id, u.email, u.login
            FROM "USERS" u
            WHERE u._id = $1
        `,
      [userId.toString()],
    );
    return MeViewDto.mapToView(me[0]);
  }
}
