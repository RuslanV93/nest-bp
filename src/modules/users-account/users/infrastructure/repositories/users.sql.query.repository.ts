import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ObjectId } from 'mongodb';
import { UserFromSql, UserViewDto } from '../../interfaces/dto/userViewDto';
import { GetUsersQueryParams } from '../../interfaces/dto/get-users.query-params.input.dto';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';

@Injectable()
export class UsersSqlQueryRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getUserById(id: ObjectId) {
    const stringId = id.toString();

    const users: UserFromSql[] = await this.dataSource.query(
      `
    SELECT u._id, u.login, u.email, u."createdAt" 
    FROM public."USERS" u
    WHERE u._id = $1
    AND u."deletedAt" IS NULL;
    `,
      [stringId],
    );

    const user = users[0];
    return UserViewDto.sqlMapToView(user);
  }
  async getUsers(query: GetUsersQueryParams) {
    const validSortDirection =
      query.sortDirection === 'asc' || query.sortDirection === 'desc'
        ? query.sortDirection
        : 'desc';
    const users: UserFromSql[] = await this.dataSource.query(
      `
          SELECT u._id, u.login, u.email, u."createdAt"
          FROM public."USERS" u
          WHERE u."deletedAt" IS NULL
            AND (
              (COALESCE($1, '') = '' OR u.login ILIKE '%' || $1 || '%')
            AND (COALESCE($2, '') = '' OR u.email ILIKE '%' || $2 || '%')
              )
          ORDER BY u."createdAt" ${validSortDirection}
    LIMIT $3 OFFSET $4;
      `,
      [
        query.searchLoginTerm,
        query.searchEmailTerm,
        query.pageSize,
        query.calculateSkipParam(),
      ],
    );
    const items = users.map(UserViewDto.sqlMapToView);
    const totalCount = items.length;
    return PaginatedViewDto.mapToView({
      items,
      page: query.pageNumber,
      size: query.pageSize,
      totalCount: totalCount || 0,
    });
  }
}
