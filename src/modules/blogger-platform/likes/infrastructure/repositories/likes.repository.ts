import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  CommentLike,
  CommentLikeDocument,
  CommentLikeModelType,
} from '../../domain/comments.likes.model';
import { ObjectId } from 'mongodb';
import {
  PostLike,
  PostLikeDocument,
  PostLikeModelType,
} from '../../domain/posts.likes.model';

@Injectable()
export class LikesRepository {
  constructor(
    @InjectModel(CommentLike.name)
    private readonly CommentLikeModel: CommentLikeModelType,
    @InjectModel(PostLike.name)
    private readonly PostLikeModel: PostLikeModelType,
  ) {}
  async findPostLike(userId: ObjectId, parentId: ObjectId) {
    return this.PostLikeModel.findOne({
      parentId: new ObjectId(parentId),
      userId: new ObjectId(userId),
    });
  }
  async findCommentLike(
    userId: ObjectId,
    parentId: ObjectId,
  ): Promise<CommentLikeDocument | PostLikeDocument | null> {
    return this.CommentLikeModel.findOne({
      parentId: new ObjectId(parentId),
      userId: new ObjectId(userId),
    });
  }
  async save(like: CommentLikeDocument | PostLikeDocument) {
    const savedLike = await like.save();
    if (!savedLike) {
      throw new InternalServerErrorException();
    }
    return savedLike;
  }
}
