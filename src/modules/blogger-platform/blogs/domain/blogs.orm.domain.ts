import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../../shared/types/base.entity.type';
import { ObjectId } from 'mongodb';
import { BlogInputDto } from '../interface/dto/blog.input-dto';

@Entity()
export class Blog extends BaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  websiteUrl: string;

  @Column()
  isMembership: boolean;

  static createInstance(blogDto: BlogInputDto) {
    const blog: Blog = new this();
    const id: ObjectId = new ObjectId();
    blog._id = id.toString();
    blog.name = blogDto.name;
    blog.description = blogDto.description;
    blog.websiteUrl = blogDto.websiteUrl;
    blog.isMembership = false;
    return blog;
  }
  updateBlog(updateBlogDto: BlogInputDto) {
    this.name = updateBlogDto.name;
    this.description = updateBlogDto.description;
    this.websiteUrl = updateBlogDto.websiteUrl;
  }
}
