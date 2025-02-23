import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import {
  CommentLike,
  CommentLikeModelType,
} from '../../domain/comments.likes.model';
import { PostLike, PostLikeModelType } from '../../domain/posts.likes.model';
import { InjectModel } from '@nestjs/mongoose';
import { NewestLikesViewDto } from '../../../posts/interface/dto/post.view-dto';

@Injectable()
export class LikesQueryRepository {
  constructor(
    @InjectModel(PostLike.name)
    private readonly PostLikeModel: PostLikeModelType,
    @InjectModel(CommentLike.name)
    private readonly CommentLikeModel: CommentLikeModelType,
  ) {}
  /** Returns like document */
  async getCommentLikeStatus(
    model: CommentLikeModelType | PostLikeModelType,
    parentId: ObjectId,
    userId?: ObjectId | null,
  ) {
    if (!userId) {
      return null;
    }
    const likeStatus = await this.CommentLikeModel.findOne({
      parentId,
      userId,
    });
    if (!likeStatus) {
      return null;
    }
    return [likeStatus];
  }
  async getPostLikeStatus(
    model: CommentLikeModelType | PostLikeModelType,
    parentId: ObjectId,
    userId?: ObjectId | null,
  ) {
    if (!userId) {
      return null;
    }
    const likeStatus = await this.PostLikeModel.findOne({
      parentId: parentId,
      userId: userId,
    });

    if (!likeStatus) {
      return null;
    }
    return [likeStatus];
  }
  /** Returns many like documents */
  async getLikeStatusesForPosts(
    parentIds: ObjectId | ObjectId[],
    userId?: ObjectId,
  ) {
    if (!userId) {
      return null;
    }
    const idsArray = Array.isArray(parentIds) ? parentIds : [parentIds];

    const likes = await this.PostLikeModel.find({
      parentId: { $in: idsArray },
      userId: userId,
    });
    if (likes.length === 0) {
      return null;
    }
    return likes;
  }
  async getLikeStatusesForComments(
    model: CommentLikeModelType | PostLikeModelType,
    parentIds: ObjectId | ObjectId[],
    userId?: ObjectId,
  ) {
    if (!userId) {
      return null;
    }

    const idsArray = Array.isArray(parentIds) ? parentIds : [parentIds];

    const likes = await this.CommentLikeModel.find({
      parentId: { $in: idsArray },
      userId: new ObjectId(userId),
    });

    if (likes.length === 0) {
      return null;
    }
    return likes;
  }
  /** Get posts last (newest) likes*/
  async getPostsNewestLikes(postIds: ObjectId[]) {
    type AggregatedLike = {
      _id: string;
      likes: NewestLikesViewDto[];
    };

    const likes: AggregatedLike[] = await this.PostLikeModel.aggregate([
      {
        $match: {
          parentId: { $in: postIds },
          status: 'Like',
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: '$parentId',
          likes: {
            $push: {
              addedAt: '$createdAt',
              userId: '$userId',
              login: '$login',
            },
          },
        },
      },
      {
        $project: {
          likes: { $slice: ['$likes', 0, 3] },
        },
      },
    ]);

    return new Map(likes.map((item) => [item._id.toString(), item.likes]));
  }
}
