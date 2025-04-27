import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from '../../domain/comments.orm.domain';
import { Repository } from 'typeorm';
import {
  CommentsSortBy,
  GetCommentsQueryParams,
} from '../../interface/dto/get-comments.query-params.input.dto';
import { SortDirection } from '../../../../../core/dto/base.query-params.input-dto';
import { CommentViewDto } from '../../interface/dto/comment.view-dto';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { CommentQueryResult } from '../../domain/dto/comment.domain.dto';

@Injectable()
export class CommentsOrmQueryRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
  ) {}
  async getComments(
    query: GetCommentsQueryParams,
    postId: number,
    userId: number,
  ) {
    const validSortDirections =
      query.sortDirection === SortDirection.desc ||
      query.sortDirection === SortDirection.asc
        ? query.sortDirection === SortDirection.asc
          ? 'ASC'
          : 'DESC'
        : 'DESC';
    const sortField =
      query.sortBy === CommentsSortBy.login ? 'usr.login' : 'comment.createdAt';

    const countQuery = this.commentsRepository
      .createQueryBuilder('comment')
      .leftJoin('user', 'user', 'comment.userId = user._id')
      .where('comment.deleted_at IS NULL')
      .andWhere('comment.postId = :postId', { postId });

    if (query.searchLoginTerm) {
      countQuery.andWhere('user.name ILIKE :search', {
        search: `%${query.searchLoginTerm}%`,
      });
    }
    const totalCount = await countQuery.getCount();

    const commentQuery = this.commentsRepository
      .createQueryBuilder('comment')
      .select('comment._id', '_id')
      .addSelect('comment.content', 'content')
      .addSelect('comment.userId', 'userId')
      .addSelect('usr.login', 'userLogin')
      .addSelect('comment.createdAt', 'createdAt')
      .leftJoin('user', 'usr', 'comment.userId = usr._id')
      .where('comment.postId = :postId', { postId });

    if (query.searchLoginTerm) {
      commentQuery.andWhere('usr.name ILIKE :search', {
        search: `%${query.searchLoginTerm}%`,
      });
    }
    commentQuery.addSelect(
      `
      (SELECT COUNT(*)
      FROM "like_dislike" ld
      WHERE ld.comment_id = comment._id
      AND ld.status = 'Like')`,
      'likesCount',
    );
    commentQuery.addSelect(
      `
      (SELECT COUNT(*)
      FROM "like_dislike" ld
      WHERE ld.comment_id = comment._id
      AND ld.status = 'Dislike')`,
      'dislikesCount',
    );

    commentQuery
      .addSelect(
        `
      CASE
      WHEN :userId::integer IS NULL THEN 'None'
      ELSE COALESCE(
      (SELECT ld.status
      FROM "like_dislike" ld
      WHERE ld.comment_id = comment._id
      AND ld.user_id = :userId
      LIMIT 1),
      'None')
      END
      `,
        'myStatus',
      )
      .setParameter(
        'userId',
        userId !== undefined && userId !== null ? userId : null,
      );
    commentQuery.orderBy(sortField, validSortDirections);
    commentQuery.limit(query.pageSize).offset(query.calculateSkipParam());

    const comments = await commentQuery.getRawMany();
    const items = comments.map(CommentViewDto.fromSqlMapToView);
    return PaginatedViewDto.mapToView({
      items,
      page: query.pageNumber,
      size: query.pageSize,
      totalCount,
    });
  }
  async getCommentById(id: number, userId?: number) {
    const commentQuery = this.commentsRepository
      .createQueryBuilder('comment')
      .select('comment._id', '_id')
      .addSelect('comment.content', 'content')
      .addSelect('comment.userId', 'userId')
      .addSelect('usr.login', 'userLogin')
      .addSelect('comment.createdAt', 'createdAt')
      .leftJoin('user', 'usr', 'comment.userId = usr._id')
      .where('comment._id = :id', { id });

    commentQuery.addSelect(
      `
      (SELECT COUNT(*)
      FROM "like_dislike" ld
      WHERE ld.comment_id = comment._id
      AND ld.status = 'Like')`,
      'likesCount',
    );
    commentQuery.addSelect(
      `
      (SELECT COUNT(*)
      FROM "like_dislike" ld
      WHERE ld.comment_id = comment._id
      AND ld.status = 'Dislike')`,
      'dislikesCount',
    );

    commentQuery
      .addSelect(
        `
    CASE 
    WHEN :userId::integer IS NULL THEN 'None'
    ELSE COALESCE(
    (SELECT ld.status
    FROM "like_dislike" ld
    WHERE ld.comment_id = comment._id
    AND ld.user_id = :userId
    LIMIT 1), 'None'
    ) END
    `,
        'myStatus',
      )
      .setParameter(
        'userId',
        userId !== undefined && userId !== null ? userId : null,
      );
    const comment: CommentQueryResult | undefined =
      await commentQuery.getRawOne();

    if (!comment) {
      throw new NotFoundException();
    }
    return CommentViewDto.fromSqlMapToView(comment);
  }
}
