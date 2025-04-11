import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from '../../domain/comments.orm.domain';
import { LikeDislike } from '../../../likes/domain/like.orm.domain';
import { Repository } from 'typeorm';
import {
  CommentsSortBy,
  GetCommentsQueryParams,
} from '../../interface/dto/get-comments.query-params.input.dto';
import { ObjectId } from 'mongodb';
import { SortDirection } from '../../../../../core/dto/base.query-params.input-dto';

@Injectable()
export class CommentsOrmQueryRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    @InjectRepository(LikeDislike)
    private readonly likesRepository: Repository<LikeDislike>,
  ) {}
  async getComments(
    query: GetCommentsQueryParams,
    postId: ObjectId,
    userId: ObjectId,
  ) {
    const postIdStr = postId.toString();
    const userIdStr = userId.toString();
    const validSortDirections =
      query.sortDirection === SortDirection.desc ||
      query.sortDirection === SortDirection.asc
        ? query.sortDirection === SortDirection.asc
          ? 'ASC'
          : 'DESC'
        : 'DESC';
    const sortField =
      query.sortBy === CommentsSortBy.login
        ? CommentsSortBy.login
        : CommentsSortBy.createdAt;

    const countQuery = this.commentsRepository
      .createQueryBuilder('comment')
      .leftJoin('user', 'user', 'comment.userId = user.id')
      .where('comment.deleted_at IS NULL')
      .andWhere('comment.postId = :postId', { postId: postIdStr });

    if (query.searchLoginTerm) {
      countQuery.andWhere('user.name ILIKE :search', {
        search: `%${query.searchLoginTerm}%`,
      });
    }
    const totalCount = await countQuery.getCount();

    const commentQuery = this.commentsRepository
      .createQueryBuilder('comment')
      .select('comment._id', 'id')
      .addSelect('comment.content', 'content')
      .addSelect('comment.userId', 'userId')
      .addSelect('user.name', 'login')
      .addSelect('comment.createdAt', 'createdAt')
      .leftJoin('user', 'user', 'comment.userId = user._id')
      .where('comment.postId = :postId', { postId: postIdStr });

    if (query.searchLoginTerm) {
      commentQuery.andWhere('user.name ILIKE :search', {
        search: `%${query.searchLoginTerm}%`,
      });
    }
    commentQuery.addSelect(
      `
      (SELECT COUNT(*)
      FROM "like_dislike" ld
      WHERE ld.commentId = comment._id
      AND ld.status = 'Like')`,
      'likesCount',
    );
    commentQuery.addSelect(
      `
      (SELECT COUNT(*)
      FROM "like_dislike" ld
      WHERE ld.commentId = comment._id
      AND ld.status = 'Dislike')`,
      'dislikesCount',
    );

    commentQuery
      .addSelect(
        `
      CASE
      WHEN :userIdStr = '' THEN 'None'
      ELSE COALESCE(
      (SELECT ld.status
      FROM "like_dislike" ld
      WHERE ld.commentId = comment._id
      AND ld.userId = :userIdStr
      LIMIT 1),
      'None')
      END
      `,
        'myStatus',
      )
      .setParameter('userIdStr', userIdStr);
    commentQuery.orderBy(sortField, validSortDirections);
    commentQuery.limit(query.pageSize).offset(query.calculateSkipParam());
  }
}
