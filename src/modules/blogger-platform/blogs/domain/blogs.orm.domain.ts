import { Column, Entity, OneToMany } from 'typeorm';
import { BazaEntity } from '../../../../shared/types/base.entity.type';
import { BlogInputDto } from '../interface/dto/blog.input-dto';
import { Post } from '../../posts/domain/posts.orm.domain';

@Entity()
export class Blog extends BazaEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ name: 'website_url' })
  websiteUrl: string;

  @Column({ name: 'is_membership' })
  isMembership: boolean;

  @OneToMany(() => Post, (p) => p.blog)
  post: Post;

  static createInstance(blogDto: BlogInputDto) {
    const blog: Blog = new this();
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
