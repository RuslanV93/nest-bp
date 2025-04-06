import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../../domain/posts.orm.domain';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import {
  GetPostsQueryParams,
  PostsSortBy,
} from '../../interface/dto/get-posts.query-params.input.dto';
import { ObjectId } from 'mongodb';
import { SortDirection } from '../../../../../core/dto/base.query-params.input-dto';
import { LikeDislike } from '../../../likes/domain/like.orm.domain';

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
    const validSortDirections =
      query.sortDirection === SortDirection.asc ||
      query.sortDirection === SortDirection.desc
        ? query.sortDirection
        : SortDirection.desc;
    const sortField =
      query.sortBy === PostsSortBy.title
        ? PostsSortBy.title
        : query.sortBy === PostsSortBy.blogName
          ? PostsSortBy.blogName
          : PostsSortBy.createdAt;

    const where: FindOptionsWhere<Post> = {};
    if (query.searchTitleTerm) {
      where.title = ILike(`%${query.searchTitleTerm}%`);
    } else if (blogId) {
      where.blogId = blogId.toString();
    }
    return [];
  }
  async getPostById(id: ObjectId, userId?: ObjectId | null) {
    const postQueryBuilder = this.postsRepository.createQueryBuilder('p');
    const likeQueryBuilder = this.likesRepository.createQueryBuilder('l');

    const lastLikesRaw = await likeQueryBuilder
      .select(
        `
    JSONB_AGG(
      JSON_BUILD_OBJECT(
        'addedAt', l.added_at,
        'userId', l.user_id,
        'login', u.login
      )
      ORDER BY l.added_at DESC
    ) AS "newestLikes"
  `,
      )
      .leftJoin('user', 'u', 'u.id = l.user_id')
      .where('l.parent_id = :id', { id: id.toString() })
      .groupBy('l.parent_id') // Группировка по parent_id для агрегации
      .getRawOne();

    const postRaw = await postQueryBuilder
      .select([
        'p._id as id',
        'p.title as title',
        'p.shortDescription as shortDescription',
        'p.content as content',
        'p.blogId as blogId',
        'b.name as blogName',
        'ld.status as myStatus',
      ])
      .leftJoin('blog', 'b', 'b._id = p.blogId')
      .leftJoin('like_dislike', 'ld', 'ld.parentId = p._id')
      .getRawOne();
    return postRaw;
  }
}
