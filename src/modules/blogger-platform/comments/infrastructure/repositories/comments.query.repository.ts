import { Injectable, NotFoundException } from '@nestjs/common';

import { ObjectId } from 'mongodb';
import { GetCommentsQueryParams } from '../../interface/dto/get-comments.query-params.input.dto';
import { FilterQuery } from 'mongoose';
import { Post } from '../../../posts/domain/posts.model';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { CommentViewDto } from '../../interface/dto/comment.view-dto';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentModelType } from '../../domain/comments.model';
import { LikesQueryRepository } from '../../../likes/infrastructure/repositories/likes.query-repository';
import {
  CommentLike,
  CommentLikeModelType,
} from '../../../likes/domain/comments.likes.model';
import { PostsRepository } from '../../../posts/infrastructure/repositories/posts.repository';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: CommentModelType,
    @InjectModel(CommentLike.name)
    private readonly commentLikeModel: CommentLikeModelType,
    private readonly likesQueryRepository: LikesQueryRepository,
    private readonly postsRepository: PostsRepository,
  ) {}

  async getComments(
    query: GetCommentsQueryParams,
    postId: ObjectId,
    userId?: ObjectId,
  ) {
    const existingPost =
      await this.postsRepository.findOneAndNotFoundException(postId);
    if (!existingPost) {
      throw new NotFoundException('Post not found');
    }
    const baseFilter: FilterQuery<Comment> = { deletedAt: null };
    const conditions: Array<FilterQuery<Post>> = [];
    if (postId) {
      conditions.push({ postId: postId });
    }
    /** If conditions exists, add them to filter */
    const filter = conditions.length
      ? { ...baseFilter, $or: conditions }
      : baseFilter;
    const comments = await this.commentModel
      .find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip(query.calculateSkipParam())
      .limit(query.pageSize);
    const commentsIds = comments.map((comment) => comment._id);
    const likes = await this.likesQueryRepository.getLikeStatusesForComments(
      this.commentLikeModel,
      commentsIds,
      userId,
    );
    const totalCount = await this.commentModel.countDocuments(filter);
    const items = comments.map((comment) =>
      CommentViewDto.mapToView(comment, likes),
    );

    return PaginatedViewDto.mapToView({
      items,
      page: query.pageNumber,
      size: query.pageSize,
      totalCount,
    });
  }
  async getCommentById(id: ObjectId, userId?: ObjectId) {
    const comment = await this.commentModel.findOne({
      _id: id,
      deletedAt: null,
    });
    const likeInfo = await this.likesQueryRepository.getCommentLikeStatus(
      this.commentLikeModel,
      id,
      userId,
    );
    if (!comment) {
      return null;
    }
    return CommentViewDto.mapToView(comment, likeInfo);
  }
}
