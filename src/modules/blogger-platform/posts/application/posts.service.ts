import { Injectable } from '@nestjs/common';
import { Post, PostDocument, PostModelType } from '../domain/posts.model';
import { InjectModel } from '@nestjs/mongoose';
import { PostInputDto } from '../interface/dto/post.input-dto';
import { BlogsRepository } from '../../blogs/infrastructure/repositories/blogs.repository';
import { DomainPost } from '../domain/posts.domain';
import { PostsRepository } from '../infrastructure/repositories/posts.repository';
import { ServiceResultObjectFactory } from '../../../../shared/utils/serviceResultObject';
import { ObjectId } from 'mongodb';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: PostModelType,
    private readonly postsRepository: PostsRepository,
    private readonly blogRepository: BlogsRepository,
  ) {}
  /** Creates new Post. Returns new post id. */
  async createPost(blogId: ObjectId, newPostDto: PostInputDto) {
    const existingBlog =
      await this.blogRepository.findOneOrNotFoundException(blogId);

    // To domainDto
    const postEntity = DomainPost.create(
      newPostDto.title,
      newPostDto.shortDescription,
      newPostDto.content,
      blogId,
      existingBlog.name,
    );

    // Getting ready to save post
    const post: PostDocument = this.postModel.createInstance(
      postEntity.toSchema(),
    );

    const newPostId = await this.postsRepository.save(post);

    if (!newPostId) {
      return ServiceResultObjectFactory.internalErrorResultObject();
    }

    return ServiceResultObjectFactory.successResultObject(newPostId);
  }

  /** Update existing post fields */
  async updatePost(id: ObjectId, updatePostDto: PostInputDto) {
    const post: PostDocument =
      await this.postsRepository.findOneAndNotFoundException(id);

    const newPostEntity = DomainPost.update(post, updatePostDto);
    post.updatePost(newPostEntity.toSchema());
    const postId = await this.postsRepository.save(post);
    return ServiceResultObjectFactory.successResultObject(postId);
  }
  /** Delete post by post id */
  async deletePost(id: ObjectId) {
    const post = await this.postsRepository.findOneAndNotFoundException(id);
    try {
      const deleteDate = post.deletePost();
      await this.postsRepository.save(post);
      return ServiceResultObjectFactory.successResultObject(deleteDate);
    } catch (error) {
      return ServiceResultObjectFactory.notFoundResultObject({
        message: error instanceof Error ? error.message : 'Blog not found',
      });
    }
  }
}
