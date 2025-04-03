import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../../domain/posts.orm.domain';
import { FindOptionsWhere, ILike, IsNull, Repository } from 'typeorm';
import {
  GetPostsQueryParams,
  PostsSortBy,
} from '../../interface/dto/get-posts.query-params.input.dto';
import { ObjectId } from 'mongodb';
import { SortDirection } from '../../../../../core/dto/base.query-params.input-dto';

@Injectable()
export class PostsOrmQueryRepository {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
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

    const [posts, totalCount]: [Post[], number] = await this.postsRepository
      .createQueryBuilder('post')
      .select('post')
      .leftJoin(
        'post.likes',
        'like_dislike',
        'like_dislike."parentId" = post._id AND like_dislike."userId" = :userId',
        { userId: userId?.toString() },
      )
      .addSelect('like_dislike.status', 'myStatus')
      .where('post."deletedAt" IS NULL')
      .andWhere(
        blogId ? 'post."blogId" = :blogId' : '1=1',
        blogId ? { blogId: blogId.toString() } : {},
      )
      .andWhere(
        "COALESCE(:search, '') = '' OR post.title ILIKE :searchPattern",
        {
          search: query.searchTitleTerm,
          searchPattern: `%${query.searchTitleTerm}%`,
        },
      )
      .getManyAndCount();
    return posts;
  }
  async getPostById(id: ObjectId, userId?: ObjectId | null) {
    const post = await this.postsRepository.findOne({
      where: { deletedAt: IsNull(), _id: id.toString() },
    });
    return post;
  }
}
