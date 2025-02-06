import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument, Model } from 'mongoose';
import { PostDomainDto } from './dto/post.domain.dto';

@Schema({ timestamps: false, versionKey: false, _id: false })
class ExtendedLikesInfo {
  @Prop()
  likesCount: number;

  @Prop()
  dislikesCount: number;
}
@Schema({ timestamps: true })
export class Post {
  @Prop()
  title: string;

  @Prop()
  shortDescription: string;

  @Prop()
  content: string;

  @Prop()
  blogId: ObjectId;

  @Prop()
  blogName: string;

  @Prop({ type: Date, nullable: true })
  deletedAt: Date | null;

  @Prop({ type: () => ExtendedLikesInfo })
  extendedLikesInfo: ExtendedLikesInfo;

  createdAt: Date;
  updatedAt: Date;

  static createInstance(this: PostModelType, postDomainDto: PostDomainDto) {
    const post = new this();
    post.title = postDomainDto.title;
    post.shortDescription = postDomainDto.shortDescription;
    post.content = postDomainDto.content;
    post.blogId = new ObjectId(postDomainDto.blogId);
    post.blogName = postDomainDto.blogName;
    post.deletedAt = null;
    post.extendedLikesInfo = postDomainDto.extendedLikesInfo;
    return post;
  }
  updatePost(updatedPost: PostDomainDto) {
    this.title = updatedPost.title;
    this.shortDescription = updatedPost.shortDescription;
    this.content = updatedPost.content;
    this.blogId = new ObjectId(updatedPost.blogId);
  }

  deletePost() {
    if (this.deletedAt !== null) {
      throw new Error('Post not Found.');
    }
    this.deletedAt = new Date();
    return this.deletedAt;
  }
}

export const PostSchema = SchemaFactory.createForClass(Post);
PostSchema.loadClass(Post);
export type PostDocument = HydratedDocument<Post>;
export type PostModelType = Model<PostDocument> & typeof Post;
