import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BazaEntity } from '../../../../shared/types/base.entity.type';
import { Blog } from '../../blogs/domain/blogs.orm.domain';
import {
  PostInputDto,
  PostInputDtoWithoutBlogId,
} from '../interface/dto/post.input-dto';
import { LikeDislike } from '../../likes/domain/like.orm.domain';

@Entity()
export class Post extends BazaEntity {
  @Column()
  title: string;

  @Column({ name: 'short_description' })
  shortDescription: string;

  @Column()
  content: string;

  @Column({ name: 'blog_id' })
  blogId: number;

  @ManyToOne(() => Blog)
  @JoinColumn({ name: 'blog_id' })
  blog: Blog;

  @OneToMany(() => LikeDislike, (like) => like.post)
  likes: LikeDislike[];

  static createInstance(
    postDto: PostInputDto | PostInputDtoWithoutBlogId,
    blogId?: number,
  ) {
    let existingBlogId: number;
    if (!blogId && 'blogId' in postDto) {
      existingBlogId = postDto.blogId;
    } else {
      existingBlogId = blogId!;
    }
    const post = new this();

    post.title = postDto.title;
    post.content = postDto.content;
    post.shortDescription = postDto.shortDescription;
    post.blogId = existingBlogId;
    return post;
  }

  updatePost(updatePostDto: PostInputDtoWithoutBlogId | PostInputDto) {
    this.title = updatePostDto.title;
    this.shortDescription = updatePostDto.shortDescription;
    this.content = updatePostDto.content;
  }
}
