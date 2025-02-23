import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument, Model } from 'mongoose';
import { CommentLikeDomainDto, LikeStatus } from './dto/like.domain.dto';

@Schema({ timestamps: true })
export class CommentLike {
  @Prop()
  parentId: ObjectId;
  @Prop()
  userId: ObjectId;
  @Prop({ type: String, enum: LikeStatus })
  status: LikeStatus;

  createdAt: Date;
  updatedAt: Date;

  static createInstance(
    this: CommentLikeModelType,
    commentLikeDomainDto: CommentLikeDomainDto,
  ) {
    const commentLike = new this();
    commentLike.status = commentLikeDomainDto.status;
    commentLike.parentId = commentLikeDomainDto.parentId;
    commentLike.userId = commentLikeDomainDto.userId;
    return commentLike;
  }
  updateLikeStatus(newStatus: LikeStatus) {
    this.status = newStatus;
  }
}

export const CommentLikeSchema = SchemaFactory.createForClass(CommentLike);
CommentLikeSchema.loadClass(CommentLike);
export type CommentLikeDocument = HydratedDocument<CommentLike>;
export type CommentLikeModelType = Model<CommentLikeDocument> &
  typeof CommentLike;
