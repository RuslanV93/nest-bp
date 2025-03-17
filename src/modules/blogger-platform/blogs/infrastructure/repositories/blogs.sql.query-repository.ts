import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  BlogsSortBy,
  GetBlogsQueryParams,
} from '../../interface/dto/get-blogs.query-params.input.dto';
import { BlogViewDto } from '../../interface/dto/blog.view-dto';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { SortDirection } from '../../../../../core/dto/base.query-params.input-dto';
import { ObjectId } from 'mongodb';

export type BlogsFromSql = {
  _id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
  isMembership: boolean;
  totalCount: string;
};
@Injectable()
export class BlogsSqlQueryRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  /** GETTING ALL BLOGS */
  async getBlogs(query: GetBlogsQueryParams) {
    const validSortDirections =
      query.sortDirection === SortDirection.asc ||
      query.sortDirection === SortDirection.desc
        ? query.sortDirection
        : 'desc';
    const sortField = query.sortBy === BlogsSortBy.name ? 'name' : 'createdAt';
    const result: BlogsFromSql[] = await this.dataSource.query(
      `
      WITH filtered_blogs AS (
        SELECT b._id, b.name, b.description, 
               b."websiteUrl", b."createdAt", b."isMembership"
        FROM "BLOGS" b
        WHERE b."deletedAt" IS NULL
          AND (COALESCE($1, '') = '' OR b.name ILIKE '%' || $1 || '%')
      )
      
      SELECT
        (SELECT COUNT(*) FROM filtered_blogs) AS "totalCount",
        fb.*
      FROM filtered_blogs fb
      ${
        sortField === 'name'
          ? `ORDER BY fb."${sortField}" COLLATE "C" ${validSortDirections}`
          : `ORDER BY fb."${sortField}" ${validSortDirections}`
      } 
      LIMIT $2 OFFSET $3
      `,
      [query.searchNameTerm, query.pageSize, query.calculateSkipParam()],
    );
    const totalCount = result.length ? parseInt(result[0].totalCount) : 0;
    const items = result.map(BlogViewDto.mapToView);
    return PaginatedViewDto.mapToView({
      items,
      page: query.pageNumber,
      size: query.pageSize,
      totalCount: totalCount,
    });
  }

  /** Get one blog by id */
  async getBlogById(id: ObjectId) {
    const blog: BlogsFromSql[] = await this.dataSource.query(
      `
    SELECT b._id, b.name, b.description, b."isMembership", 
           b."websiteUrl", b."createdAt"
           FROM "BLOGS" b
    WHERE b."deletedAt" IS NULL AND b."_id" = $1
    `,
      [id.toString()],
    );
    if (!blog.length) {
      throw new NotFoundException('Blog not found');
    }
    return BlogViewDto.mapToView(blog[0]);
  }
}
