import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../../domain/posts.orm.domain';
import { Repository } from 'typeorm';
import {
  GetPostsQueryParams,
  PostsSortBy,
} from '../../interface/dto/get-posts.query-params.input.dto';
import { ObjectId } from 'mongodb';
import { SortDirection } from '../../../../../core/dto/base.query-params.input-dto';
import { LikeDislike } from '../../../likes/domain/like.orm.domain';
import { PostViewDto } from '../../interface/dto/post.view-dto';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { PostQueryResult } from '../../domain/dto/post.domain.dto';

@Injectable()
export class PostsOrmQueryRepository {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    @InjectRepository(LikeDislike)
    private readonly likesRepository: Repository<LikeDislike>,
  ) {}
  async getPosts(
    query: GetPostsQueryParams,
    blogId?: ObjectId,
    userId?: ObjectId,
  ) {
    const blogIdStr = blogId?.toString() || '';
    const userIdStr = userId?.toString() || '';
    const validSortDirection =
      query.sortDirection === SortDirection.asc ||
      query.sortDirection === SortDirection.desc
        ? query.sortDirection === SortDirection.asc
          ? 'ASC'
          : 'DESC'
        : 'DESC';
    const sortField =
      query.sortBy === PostsSortBy.title
        ? 'post.title'
        : query.sortBy === PostsSortBy.blogName
          ? 'blog.name'
          : 'post.created_at';

    // Базовый запрос для расчета общего количества записей
    const countQuery = this.postsRepository
      .createQueryBuilder('post')
      .where('post.deleted_at IS NULL');

    // Добавляем фильтрацию по ID блога, если передан
    if (blogIdStr) {
      countQuery.andWhere('post.blog_id = :blogIdStr', { blogIdStr });
    }

    // Добавляем поиск по названию, если передан
    if (query.searchTitleTerm) {
      countQuery.andWhere('post.title ILIKE :searchTerm', {
        searchTerm: `%${query.searchTitleTerm}%`,
      });
    }

    // Getting total count of posts
    const totalCount: number = await countQuery.getCount();

    // Создаем основной запрос для получения данных
    const postsQuery = this.postsRepository
      .createQueryBuilder('post')
      .select('post._id', 'id')
      .addSelect('post.title', 'title')
      .addSelect('post.short_description', 'shortDescription')
      .addSelect('post.content', 'content')
      .addSelect('post.blog_id', 'blogId')
      .addSelect('blog.name', 'blogName')
      .addSelect('post.created_at', 'createdAt')
      .leftJoin('blog', 'blog', 'blog._id = post.blog_id')
      .where('post.deleted_at IS NULL');

    if (blogIdStr) {
      postsQuery.andWhere('post.blog_id = :blogIdStr', { blogIdStr });
    }

    if (query.searchTitleTerm) {
      postsQuery.andWhere('post.title ILIKE :searchTerm', {
        searchTerm: `%${query.searchTitleTerm}%`,
      });
    }

    postsQuery.addSelect(
      `
    (SELECT COUNT(*) 
     FROM "like_dislike" ld 
     WHERE ld.post_id = post._id 
     AND ld.status = 'Like')`,
      'likesCount',
    );

    postsQuery.addSelect(
      `
    (SELECT COUNT(*) 
     FROM "like_dislike" ld 
     WHERE ld.post_id = post._id 
     AND ld.status = 'Dislike')`,
      'dislikesCount',
    );

    postsQuery
      .addSelect(
        `
    CASE 
      WHEN :userIdStr = '' THEN 'None'
      ELSE COALESCE(
        (SELECT ld.status 
         FROM "like_dislike" ld 
         WHERE ld.post_id = post._id 
         AND ld.user_id = :userIdStr 
         LIMIT 1), 
        'None')
    END`,
        'myStatus',
      )
      .setParameter('userIdStr', userIdStr);

    postsQuery.addSelect(
      `
    COALESCE(
      (SELECT jsonb_agg(
        json_build_object(
          'addedAt', TO_CHAR(ld.created_at, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
          'userId', ld.user_id,
          'login', u.login
        )
        ORDER BY ld.created_at DESC
       )
       FROM (
         SELECT * FROM "like_dislike" ld2
         WHERE ld2.post_id = post._id AND ld2.status = 'Like' 
         ORDER BY ld2.created_at DESC 
         LIMIT 3
       ) ld
       LEFT JOIN "user" u ON u._id = ld.user_id
      ), 
      '[]'::jsonb)`,
      'newestLikes',
    );

    postsQuery.orderBy(sortField, validSortDirection);

    postsQuery.limit(query.pageSize).offset(query.calculateSkipParam());

    // Получаем результаты
    const posts = await postsQuery.getRawMany();

    const items = posts.map(PostViewDto.fromSqlMapToView);
    return PaginatedViewDto.mapToView({
      items,
      page: query.pageNumber,
      size: query.pageSize,
      totalCount,
    });
  }

  async getPostById(id: ObjectId, userId?: ObjectId | null) {
    const postIdStr = id.toString();
    const userIdStr = userId?.toString();
    const query = this.postsRepository
      .createQueryBuilder('post')
      .select('post._id', 'id')
      .addSelect('post.title', 'title')
      .addSelect('post.short_description', 'shortDescription')
      .addSelect('post.content', 'content')
      .addSelect('post.blog_id', 'blogId')
      .addSelect('blog.name', 'blogName')
      .addSelect('post.created_at', 'createdAt')
      // Likes Count
      .addSelect(
        `
      (SELECT COUNT(*) 
       FROM "like_dislike" ld 
       WHERE ld.post_id = post._id 
       AND ld.status = 'Like')`,
        'likesCount',
      )
      // Dislikes Count
      .addSelect(
        `
      (SELECT COUNT(*) 
       FROM "like_dislike" ld 
       WHERE ld.post_id = post._id 
       AND ld.status = 'Dislike')`,
        'dislikesCount',
      )
      // Like/Dislike status for current user
      .addSelect(
        `
      CASE 
        WHEN :userIdStr = '' THEN 'None'
        ELSE COALESCE(
          (SELECT ld.status 
           FROM "like_dislike" ld 
           WHERE ld.post_id = post._id 
           AND ld.user_id = :userIdStr 
           LIMIT 1), 
          'None')
      END`,
        'myStatus',
      )
      // Getting las 3 likes
      .addSelect(
        `
      COALESCE(
        (SELECT jsonb_agg(
          json_build_object(
            'addedAt', ld.created_at,
            'userId', ld.user_id,
            'login', u.login
          )
          ORDER BY ld.created_at DESC
         )
         FROM (
           SELECT * FROM "like_dislike" 
           WHERE post_id = post._id AND status = 'Like' 
           ORDER BY created_at DESC 
           LIMIT 3
         ) ld
         LEFT JOIN "user" u ON u._id = ld.user_id
        ), 
        '[]'::jsonb)`,
        'newestLikes',
      )
      .leftJoin('blog', 'blog', 'blog._id = post.blog_id')
      .where('post.deleted_at IS NULL')
      .andWhere('post._id = :postIdStr')
      .setParameter('postIdStr', postIdStr)
      .setParameter('userIdStr', userIdStr);

    const result: PostQueryResult | undefined = await query.getRawOne();

    if (!result) {
      return null;
    }
    return PostViewDto.fromSqlMapToView(result);
  }
}
