import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  CommentsSortBy,
  GetCommentsQueryParams,
} from '../../interface/dto/get-comments.query-params.input.dto';
import { ObjectId } from 'mongodb';
import { SortDirection } from '../../../../../core/dto/base.query-params.input-dto';

@Injectable()
export class CommentsSqlQueryRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}
  /** getting all comments */

  async getComments(
    query: GetCommentsQueryParams,
    postId: ObjectId,
    userId?: ObjectId,
  ) {
    const postIdStr = postId.toString();
    const userIdStr = userId?.toString() || '';
    const validSortDirections =
      query.sortDirection === SortDirection.asc ||
      query.sortDirection === SortDirection.desc
        ? query.sortDirection
        : 'desc';
    const sortField =
      query.sortBy === CommentsSortBy.login ? 'login' : 'createdAt';

    const sqlQuery = `
  WITH filtered_comments AS (
    SELECT c._id, c.content, c."postId", c."commentatorId" as "userId", u.login as "userLogin", c."createdAt"
    FROM "COMMENTS" c
    LEFT JOIN "USERS" u ON c."commentatorId" = u._id
    WHERE c."deletedAt" IS NULL
    AND c."postId" = $1
  ),
  likes_dislikes_count AS (
    SELECT 
      cl."parentId",
      COUNT(CASE WHEN cl."status" = 'Like' THEN 1 END) AS "likesCount",
      COUNT(CASE WHEN cl."status" = 'Dislike' THEN 1 END) AS "dislikesCount"
    FROM "COMMENT_LIKES" cl
    WHERE cl."parentId" = ANY(SELECT fc._id FROM filtered_comments fc)
    GROUP BY cl."parentId"
  ),
  my_status AS (
    SELECT cl."parentId", cl.status as "myStatus"
    FROM "COMMENT_LIKES" cl
    WHERE COALESCE($2, '') <> '' AND cl."userId" = $2
    AND cl."parentId" = ANY(SELECT fc._id FROM filtered_comments fc)
  )
  
  SELECT
    (SELECT COUNT(*) FROM filtered_comments) AS "totalCount",
    fc._id as id, fc.content, 
    fc."userId", fc."userLogin", 
    fc."createdAt", 
    COALESCE(ldc."likesCount", 0) as "likesCount", 
    COALESCE(ldc."dislikesCount", 0) as "dislikesCount", 
    COALESCE(ms."myStatus", 'None') as "myStatus"
  FROM filtered_comments fc
  LEFT JOIN likes_dislikes_count ldc ON ldc."parentId" = fc._id
  LEFT JOIN my_status ms ON ms."parentId" = fc._id
  ORDER BY fc."${sortField}" ${validSortDirections}
  LIMIT $3 OFFSET $4
  `;

    const result = await this.dataSource.query(sqlQuery, [
      postIdStr,
      userIdStr || '',
      query.pageSize,
      query.calculateSkipParam(),
    ]);
  }
}
