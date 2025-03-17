import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  GetPostsQueryParams,
  PostsSortBy,
} from '../../interface/dto/get-posts.query-params.input.dto';

import { SortDirection } from '../../../../../core/dto/base.query-params.input-dto';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { ObjectId } from 'mongodb';
import { PostQueryResult } from '../../domain/dto/post.domain.dto';
import { PostViewDto } from '../../interface/dto/post.view-dto';

@Injectable()
export class PostsSqlQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getPosts(
    query: GetPostsQueryParams,
    blogId?: ObjectId,
    userId?: ObjectId,
  ) {
    const blogIdStr = blogId?.toString() || '';
    const userIdStr = userId?.toString() || '';
    const validSortDirections =
      query.sortDirection === SortDirection.asc ||
      query.sortDirection === SortDirection.desc
        ? query.sortDirection
        : 'desc';
    const sortField =
      query.sortBy === PostsSortBy.title
        ? 'title'
        : query.sortBy === PostsSortBy.blogName
          ? 'blogName'
          : 'createdAt';

    const countQuery = `
        SELECT COUNT(*) as "totalCount"
        FROM "POSTS" p
        WHERE p."deletedAt" IS NULL
          AND (COALESCE($1, '') = '' OR p."blogId" = $1)
          AND (COALESCE($2, '') = '' OR p.title ILIKE '%' || $2 || '%')
    `;

    const countResult: { totalCount: string }[] = await this.dataSource.query(
      countQuery,
      [blogIdStr || '', query.searchTitleTerm || ''],
    );
    const totalCount = parseInt(countResult[0].totalCount);

    const sqlQuery = `
    WITH filtered_posts AS (
    SELECT p._id, p.title, p."shortDescription", 
           p.content, p."blogId", b."name" as "blogName", 
           p."createdAt"
    FROM "POSTS" p
    LEFT JOIN "BLOGS" b ON b._id = p."blogId" 
    WHERE p."deletedAt" IS NULL
      AND (COALESCE($1, '') = '' OR p."blogId" = $1)
      AND (COALESCE($2, '') = '' OR p.title ILIKE '%' || $2 || '%')
    ORDER BY
            CASE
                WHEN '${query.sortBy}' = 'title' THEN p.title::text
                WHEN '${query.sortBy}' = 'blogName' THEN b."name"::text
                ELSE p."createdAt"::text
            END ${validSortDirections}
    LIMIT $4 OFFSET $5
    ),
    likes_dislikes_count AS ( 
    SELECT 
        pl."parentId",
        COUNT(CASE WHEN pl."status" = 'Like' THEN 1 END) AS "likesCount",
        COUNT(CASE WHEN pl."status" = 'Dislike' THEN 1 END) AS "dislikesCount"
    FROM "POST_LIKES" pl
    WHERE pl."parentId" IN (SELECT _id FROM filtered_posts)
    GROUP BY pl."parentId"
    ),
    newest_likes AS (
    SELECT subquery."parentId", 
    JSONB_AGG(JSON_BUILD_OBJECT(
        'addedAt', subquery."addedAt", 
        'userId', subquery."userId", 
        'login', subquery.login)
        ORDER BY subquery."addedAt" DESC
    ) as "newestLikes"
    FROM (
        SELECT pl."parentId", pl."createdAt" AS "addedAt", pl."userId", u.login,
               ROW_NUMBER() OVER (PARTITION BY pl."parentId" ORDER BY pl."createdAt" DESC) AS rn
        FROM "POST_LIKES" pl
        LEFT JOIN "USERS" u ON pl."userId" = u."_id"
        WHERE pl."parentId" IN (SELECT _id FROM filtered_posts)
        AND pl."status" = 'Like'
    ) AS subquery
    WHERE subquery.rn <= 3
    GROUP BY subquery."parentId"
    ),
    my_status AS (
    SELECT pl."parentId", pl.status as "myStatus"
    FROM "POST_LIKES" pl
    WHERE COALESCE($3, '') <> '' AND pl."userId" = $3
    AND pl."parentId" IN (SELECT _id FROM filtered_posts)
    )

    SELECT
    fp._id as id, fp.title, fp."shortDescription", 
    fp.content, fp."blogId", fp."blogName", 
    fp."createdAt", 
    COALESCE(ldc."likesCount", 0) as "likesCount", 
    COALESCE(ldc."dislikesCount", 0) as "dislikesCount", 
    COALESCE(nl."newestLikes", '[]'::jsonb) as "newestLikes",
    COALESCE(ms."myStatus", 'None') as "myStatus"
    FROM filtered_posts fp
    LEFT JOIN likes_dislikes_count ldc ON ldc."parentId" = fp._id
    LEFT JOIN newest_likes nl ON nl."parentId" = fp._id
    LEFT JOIN my_status ms ON ms."parentId" = fp._id
    ORDER BY fp."${sortField}" ${validSortDirections}
    `;

    const result: PostQueryResult[] = await this.dataSource.query(sqlQuery, [
      blogIdStr || '',
      query.searchTitleTerm || '',
      userIdStr || '',
      query.pageSize,
      query.calculateSkipParam(),
    ]);

    const items = result.map(PostViewDto.fromSqlMapToView);
    return PaginatedViewDto.mapToView({
      items,
      page: query.pageNumber,
      size: query.pageSize,
      totalCount,
    });
  }

  async getPostById(postId: ObjectId, userId?: ObjectId | null) {
    const postIdStr = postId.toString();
    const userIdStr = userId?.toString() || '';
    const sqlQuery = `
  WITH post_data AS (
    SELECT p._id, p.title, p."shortDescription", 
           p.content, p."blogId", b."name" as "blogName", 
           p."createdAt"
    FROM "POSTS" p
    LEFT JOIN "BLOGS" b ON b._id = p."blogId" 
    WHERE p."deletedAt" IS NULL
      AND p._id = $1
  ),
  likes_dislikes_count AS ( 
    SELECT 
        pl."parentId",
        COUNT(CASE WHEN pl."status" = 'Like' THEN 1 END) AS "likesCount",
        COUNT(CASE WHEN pl."status" = 'Dislike' THEN 1 END) AS "dislikesCount"
    FROM "POST_LIKES" pl
    WHERE pl."parentId" = $1
    GROUP BY pl."parentId"
  ),
  newest_likes AS (
    SELECT subquery."parentId", 
    JSONB_AGG(JSON_BUILD_OBJECT(
        'addedAt', subquery."addedAt", 
        'userId', subquery."userId", 
        'login', subquery.login)
        ORDER BY subquery."addedAt" DESC
    ) as "newestLikes"
    FROM (
        SELECT pl."parentId", pl."createdAt" AS "addedAt", pl."userId", u.login,
               ROW_NUMBER() OVER (PARTITION BY pl."parentId" ORDER BY pl."createdAt" DESC) AS rn
        FROM "POST_LIKES" pl
        LEFT JOIN "USERS" u ON pl."userId" = u."_id"
        WHERE pl."parentId" = $1
        AND pl."status" = 'Like'
    ) AS subquery
    WHERE subquery.rn <= 3
    GROUP BY subquery."parentId"
  ),
  my_status AS (
    SELECT pl."parentId", pl.status as "myStatus"
    FROM "POST_LIKES" pl
    WHERE COALESCE($2, '') <> '' AND pl."userId" = $2
    AND pl."parentId" = $1
  )
  
  SELECT
    pd._id as id, pd.title, pd."shortDescription", 
    pd.content, pd."blogId", pd."blogName", 
    pd."createdAt", 
    COALESCE(ldc."likesCount", 0) as "likesCount", 
    COALESCE(ldc."dislikesCount", 0) as "dislikesCount", 
    COALESCE(nl."newestLikes", '[]'::jsonb) as "newestLikes",
    COALESCE(ms."myStatus", 'None') as "myStatus"
  FROM post_data pd
  LEFT JOIN likes_dislikes_count ldc ON ldc."parentId" = pd._id
  LEFT JOIN newest_likes nl ON nl."parentId" = pd._id
  LEFT JOIN my_status ms ON ms."parentId" = pd._id
  `;

    const result: PostQueryResult[] = await this.dataSource.query(sqlQuery, [
      postIdStr,
      userIdStr || '',
    ]);

    if (!result.length) {
      return null;
    }

    return PostViewDto.fromSqlMapToView(result[0]);
  }
}
