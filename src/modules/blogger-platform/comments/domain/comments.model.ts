import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument, Model } from 'mongoose';
import { CommentDomainDto } from './dto/comment.domain.dto';

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

  @Prop({ type: () => CommentatorInfo })
  commentatorInfo: CommentatorInfo;

  @Prop({ type: Date, nullable: true })
  deletedAt: Date | null;

  @Prop({ type: () => LikesInfo })
  likesInfo: LikesInfo;

  createdAt: Date;
  updatedAt: Date;

  static createInstance(
    this: CommentModelType,
    commentDomainDto: CommentDomainDto,
  ) {
    const comment = new this();
    comment.content = commentDomainDto.content;
    comment.commentatorInfo.userId = new ObjectId(
      commentDomainDto.commentatorInfo.userId,
    );
    comment.commentatorInfo.userLogin =
      commentDomainDto.commentatorInfo.userLogin;
    comment.deletedAt = null;
    comment.likesInfo = commentDomainDto.likesInfo;
  }
  updateComment() {}
  deleteComment() {
    if (this.deletedAt !== null) {
      throw new Error('Post not Found.');
    }
    this.deletedAt = new Date();
    return this.deletedAt;
  }
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
export type CommentDocument = HydratedDocument<Comment>;
export type CommentModelType = Model<CommentDocument> & typeof Comment;
