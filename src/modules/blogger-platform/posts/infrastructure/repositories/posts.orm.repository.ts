import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import { Post } from '../../domain/posts.orm.domain';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';

@Injectable()
export class PostsOrmRepository {
  constructor(
    @InjectRepository(Post)
    private readonly postOrmRepository: Repository<Post>,
  ) {}
  async findOne(id: ObjectId) {
    const post = await this.postOrmRepository.findOne({
      where: { _id: id.toString(), deletedAt: IsNull() },
    });
    return post;
  }
  async findOneAndNotFoundException(id: ObjectId) {
    const post = await this.findOne(id);
    if (!post) {
      throw new NotFoundException('Post not Found.');
    }
    return post;
  }
  async save(post: Post): Promise<string> {
    const newPost = await this.postOrmRepository.save(post);
    return newPost._id;
  }

  async createPost(post: Post) {
    try {
      const createdPost = this.postOrmRepository.create(post);
      const newPostId: string = await this.save(createdPost);
      // if (!newPostId) {
      //   throw new InternalServerErrorException('Something went wrong.');
      // }
      return new ObjectId(newPostId);
    } catch (error) {
      console.log(error);
    }
  }
  async deletePost(postToDelete: Post) {
    await this.postOrmRepository.softRemove(postToDelete);
  }
}
