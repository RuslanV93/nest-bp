import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import {
  BlogsSortBy,
  GetBlogsQueryParams,
} from '../../interface/dto/get-blogs.query-params.input.dto';
import { SortDirection } from '../../../../../core/dto/base.query-params.input-dto';
import { BlogViewDto } from '../../interface/dto/blog.view-dto';
import { Blog } from '../../domain/blogs.orm.domain';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { ObjectId } from 'mongodb';

@Injectable()
export class BlogsOrmQueryRepository {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  /** GETTING ALL BLOGS */
  async getBlogs(query: GetBlogsQueryParams) {
    const validSortDirection =
      query.sortDirection === SortDirection.asc ||
      query.sortDirection === SortDirection.desc
        ? query.sortDirection === SortDirection.asc
          ? 'ASC'
          : 'DESC'
        : 'DESC';
    const sortField =
      query.sortBy === BlogsSortBy.name
        ? BlogsSortBy.name
        : BlogsSortBy.createdAt;

    let queryBuilder = this.entityManager
      .createQueryBuilder(Blog, 'blog')
      .select('blog')
      .where('blog.deletedAt IS NULL');

    if (query.searchNameTerm) {
      queryBuilder = queryBuilder.andWhere('blog.name ILIKE :searchPattern', {
        searchPattern: `%${query.searchNameTerm}%`,
      });
    }

    const [blogs, totalCount]: [Blog[], number] = await queryBuilder
      .orderBy(
        sortField === BlogsSortBy.name
          ? `blog.${sortField} COLLATE "C"`
          : `blog.${sortField}`,
        validSortDirection,
      )
      .limit(query.pageSize)
      .offset(query.calculateSkipParam())
      .getManyAndCount();

    const items = blogs.map(BlogViewDto.mapToView);
    return PaginatedViewDto.mapToView({
      items,
      page: query.pageNumber,
      size: query.pageSize,
      totalCount: totalCount,
    });
  }

  /** Get one blog by id */
  async getBlogById(id: ObjectId) {
    const blog: Blog | null = await this.entityManager
      .createQueryBuilder(Blog, 'blog')
      .select('blog')
      .where('blog.deletedAt IS NULL')
      .andWhere('blog._id = :id', { id: id.toString() })
      .getOne();
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    return BlogViewDto.mapToView(blog);
  }
}
