import {
  PostInputDto,
  PostInputDtoWithoutBlogId,
} from '../../interface/dto/post.input-dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsSqlRepository } from '../../infrastructure/repositories/posts.sql.repository';
import { ObjectId } from 'mongodb';
import { InternalServerErrorException } from '@nestjs/common';
import { SqlDomainPost } from '../../domain/posts.sql.domain';
import { BlogsSqlRepository } from '../../../blogs/infrastructure/repositories/blogs.sql.repository';
import { BlogsOrmRepository } from '../../../blogs/infrastructure/repositories/blogs.orm.repository';
import { PostsOrmRepository } from '../../infrastructure/repositories/posts.orm.repository';
import { Post } from '../../domain/posts.orm.domain';

export class CreatePostCommand {
  constructor(
    public blogId: ObjectId,
    public newPostDto: PostInputDto | PostInputDtoWithoutBlogId,
  ) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
  constructor(
    private readonly postsRepository: PostsOrmRepository,
    private readonly blogsRepository: BlogsOrmRepository,
  ) {}
  async execute(command: CreatePostCommand) {
    await this.blogsRepository.findOneOrNotFoundException(command.blogId);
    const post = Post.createInstance(command.newPostDto);

    const newPostId = await this.postsRepository.createPost(post);

    if (!newPostId) {
      throw new InternalServerErrorException('Something went wrong');
    }

    return newPostId;
  }
}
