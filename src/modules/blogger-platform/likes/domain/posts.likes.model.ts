// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { ObjectId } from 'mongodb';
// import { LikeStatus, PostLikeDomainDto } from './dto/like.domain.dto';
// import { HydratedDocument, Model } from 'mongoose';
//
// @Schema({ timestamps: true })
// export class PostLike {
//   @Prop()
//   parentId: ObjectId;
//   @Prop()
//   userId: ObjectId;
//   @Prop()
//   login: string;
//   @Prop({ type: String, enum: LikeStatus })
//   status: LikeStatus;
//
//   createdAt: Date;
//   updatedAt: Date;
//
//   static createInstance(
//     this: PostLikeModelType,
//     postLikeDomainDto: PostLikeDomainDto,
//   ) {
//     const postLike = new this();
//     postLike.status = postLikeDomainDto.status;
//     postLike.parentId = postLikeDomainDto.parentId;
//     postLike.userId = postLikeDomainDto.userId;
//     postLike.login = postLikeDomainDto.login;
//     return postLike;
//   }
//   updateLikeStatus(newStatus: LikeStatus) {
//     this.status = newStatus;
//   }
// }
//
// export const PostLikeSchema = SchemaFactory.createForClass(PostLike);
// PostLikeSchema.loadClass(PostLike);
// export type PostLikeDocument = HydratedDocument<PostLike>;
// export type PostLikeModelType = Model<PostLikeDocument> & typeof PostLike;
