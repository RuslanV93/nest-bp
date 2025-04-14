import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument, Model } from 'mongoose';
import { CommentDomainDto } from './dto/comment.domain.dto';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exception';

@Schema({ timestamps: false, _id: false, versionKey: false })
export class CommentatorInfo {
  @Prop()
  userId: ObjectId;
  @Prop()
  userLogin: string;
}

@Schema({ timestamps: false, _id: false, versionKey: false })
export class LikesInfo {
  @Prop()
  likesCount: number;

  @Prop()
  dislikesCount: number;
}

@Schema({ timestamps: true })
export class Comment {
  @Prop()
  content: string;
  @Prop()
  postId: ObjectId;

  @Prop({ type: () => CommentatorInfo })
  commentatorInfo: CommentatorInfo;

  @Prop({ type: Date, nullable: true })
  deletedAt: Date | null;

  @Prop({ type: () => LikesInfo })
  likesInfo: LikesInfo;

  createdAt: Date;
  updatedAt: Date;

  static createInstance(commentDomainDto: CommentDomainDto) {
    const comment = new this();
    comment.content = commentDomainDto.content;
    comment.postId = commentDomainDto.postId;
    comment.commentatorInfo = {
      userId: commentDomainDto.commentatorInfo.userId,
      userLogin: commentDomainDto.commentatorInfo.userLogin,
    };
    comment.deletedAt = null;
    comment.likesInfo = { likesCount: 0, dislikesCount: 0 };

    return comment;
  }
  updateComment(newContent: string) {
    this.content = newContent;
    return this;
  }
  updateLikesInfo(likeCounter: { like: number; dislike: number }) {
    this.likesInfo.likesCount += likeCounter.like;
    this.likesInfo.dislikesCount += likeCounter.dislike;
  }
  deleteComment() {
    if (this.deletedAt !== null) {
      throw NotFoundDomainException.create('Comment not found');
    }
    this.deletedAt = new Date();
    return this.deletedAt;
  }
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
CommentSchema.loadClass(Comment);
export type CommentDocument = HydratedDocument<Comment>;
export type CommentModelType = Model<CommentDocument> & typeof Comment;
