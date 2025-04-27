import { Injectable, NotFoundException } from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import { Post } from '../../domain/posts.orm.domain';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostsOrmRepository {
  constructor(
    @InjectRepository(Post)
    private readonly postOrmRepository: Repository<Post>,
  ) {}
  async findOne(id: number) {
    return this.postOrmRepository.findOne({
      where: { _id: id, deletedAt: IsNull() },
    });
  }
  async findOneAndNotFoundException(id: number) {
    const post = await this.findOne(id);

    if (!post) {
      throw new NotFoundException('Post not Found.');
    }
    return post;
  }
  async save(post: Post): Promise<number> {
    const newPost = await this.postOrmRepository.save(post);
    return newPost._id;
  }

  async createPost(post: Post) {
    try {
      const createdPost = this.postOrmRepository.create(post);
      return this.save(createdPost);
      // if (!newPostId) {
      //   throw new InternalServerErrorException('Something went wrong.');
      // }
    } catch (error) {
      console.log(error);
    }
  }
  async deletePost(postToDelete: Post) {
    await this.postOrmRepository.softRemove(postToDelete);
  }
}
