import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ObjectId } from 'mongodb';
import {
  LikeSqlDtoType,
  ParentType,
  SqlDomainLike,
} from '../../domain/like.sql.domain';

@Injectable()
export class LikesSqlRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}
  async findLike(userId: ObjectId, parentId: ObjectId, parentType: ParentType) {
    const table =
      parentType === ParentType.POST ? 'POST_LIKES' : 'COMMENT_LIKES';
    const like: LikeSqlDtoType[] = await this.dataSource.query(
      `
    SELECT * FROM "${table}"
    WHERE "userId" = $1 AND "parentId" = $2
    `,
      [userId.toString(), parentId.toString()],
    );
    if (!like.length) {
      return null;
    }
    return SqlDomainLike.fromSqlResult(like[0], parentType);
  }
  async createLike(like: SqlDomainLike) {
    const table =
      like.parentType === ParentType.POST ? 'POST_LIKES' : 'COMMENT_LIKES';
    await this.dataSource.query(
      `
    INSERT INTO "${table}" ("_id", "parentId", "userId", "status")
    VALUES ($1, $2, $3, $4)
    
    `,
      [like._id, like.parentId, like.userId, like.status],
    );
  }
  async updateLike(like: SqlDomainLike) {
    const table =
      like.parentType === ParentType.POST ? 'POST_LIKES' : 'COMMENT_LIKES';
    await this.dataSource.query(`
    UPDATE "${table}"
    SET "status" = '${like.status}'
    WHERE "userId" = '${like.userId}' AND "parentId" = '${like.parentId}';
    `);
  }
}
