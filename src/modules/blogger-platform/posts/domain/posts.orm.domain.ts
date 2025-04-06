import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../../shared/types/base.entity.type';
import { Blog } from '../../blogs/domain/blogs.orm.domain';
import {
  PostInputDto,
  PostInputDtoWithoutBlogId,
} from '../interface/dto/post.input-dto';
import { ObjectId } from 'mongodb';
import { LikeDislike } from '../../likes/domain/like.orm.domain';

@Entity()
export class Post extends BaseEntity {
  @Column()
  title: string;

  @Column({ name: 'short_description' })
  shortDescription: string;

  @Column()
  content: string;

  @Column({ name: 'blog_id' })
  blogId: string;

  @ManyToOne(() => Blog)
  @JoinColumn({ name: 'blogId' })
  blog: Blog;

  @OneToMany(() => LikeDislike, (like) => like.post)
  likes: LikeDislike[];

  static createInstance(
    postDto: PostInputDto | PostInputDtoWithoutBlogId,
    blogId?: ObjectId,
  ) {
    let existingBlogId: ObjectId;
    if (!blogId && 'blogId' in postDto) {
      existingBlogId = postDto.blogId;
    } else {
      existingBlogId = blogId!;
    }
    const post = new this();
    const id = new ObjectId();

    post._id = id.toString();
    post.title = postDto.title;
    post.content = postDto.content;
    post.shortDescription = postDto.shortDescription;
    post.blogId = existingBlogId.toString();
    return post;
  }

  updatePost(updatePostDto: PostInputDto) {
    this.title = updatePostDto.title;
    this.shortDescription = updatePostDto.shortDescription;
    this.content = updatePostDto.content;
  }
}
