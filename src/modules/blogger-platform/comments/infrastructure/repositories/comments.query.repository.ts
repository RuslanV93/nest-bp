import { Injectable } from '@nestjs/common';

import { ObjectId } from 'mongodb';
import { GetCommentsQueryParams } from '../../interface/dto/get-comments.query-params.input.dto';
import { FilterQuery } from 'mongoose';
import { Post } from '../../../posts/domain/posts.model';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { CommentViewDto } from '../../interface/dto/comment.view-dto';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentModelType } from '../../domain/comments.model';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: CommentModelType,
  ) {}

  async getComments(query: GetCommentsQueryParams, postId: ObjectId) {
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

    const totalCount = await this.commentModel.countDocuments(filter);
    const items = comments.map(CommentViewDto.mapToView);
    return PaginatedViewDto.mapToView({
      items,
      page: query.pageNumber,
      size: query.pageSize,
      totalCount,
    });
  }
  async getCommentById(id: string) {
    const comment = await this.commentModel.findOne({ _id: new ObjectId(id) });
    if (!comment) {
      return null;
    }
    return CommentViewDto.mapToView(comment);
  }
}
