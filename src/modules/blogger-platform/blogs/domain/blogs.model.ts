import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BlogDomainDto } from './dto/blog.domain-dto';
import { HydratedDocument, Model } from 'mongoose';

@Schema({ timestamps: true })
export class Blog {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  websiteUrl: string;
  @Prop()
  isMembership: boolean;

  @Prop({ type: Date, nullable: true })
  deletedAt: Date | null;

  createdAt: Date;
  updatedAt: Date;

  static createInstance(this: BlogModelType, blogDomainDto: BlogDomainDto) {
    const blog = new this();
    blog.name = blogDomainDto.name;
    blog.description = blogDomainDto.description;
    blog.websiteUrl = blogDomainDto.websiteUrl;
    blog.isMembership = blogDomainDto.isMembership;
    blog.deletedAt = null;
    return blog;
  }

  updateBlog(updatedBlog: BlogDomainDto) {
    this.name = updatedBlog.name;
    this.description = updatedBlog.description;
    this.websiteUrl = updatedBlog.websiteUrl;
  }

  deleteBlog() {
    if (this.deletedAt !== null) {
      throw new Error('Blog not found.');
    }
    this.deletedAt = new Date();
    return this.deletedAt;
  }
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
BlogSchema.loadClass(Blog);
export type BlogDocument = HydratedDocument<Blog>;
export type BlogModelType = Model<BlogDocument> & typeof Blog;
