import {
  PostInputDto,
  PostInputDtoWithoutBlogId,
} from '../../interface/dto/post.input-dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsSqlRepository } from '../../infrastructure/repositories/posts.sql.repository';
import { ObjectId } from 'mongodb';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SqlDomainPost } from '../../domain/posts.sql.domain';
import { BlogsSqlRepository } from '../../../blogs/infrastructure/repositories/blogs.sql.repository';

export class CreatePostCommand {
  constructor(
    public blogId: ObjectId,
    public newPostDto: PostInputDto | PostInputDtoWithoutBlogId,
  ) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
  constructor(
    private readonly postsRepository: PostsSqlRepository,
    private readonly blogsRepository: BlogsSqlRepository,
  ) {}
  async execute(command: CreatePostCommand): Promise<ObjectId> {
    await this.blogsRepository.findOneOrNotFoundException(command.blogId);
    const post = SqlDomainPost.createInstance(
      command.newPostDto,
      command.blogId,
    );
    const newPostId = await this.postsRepository.createPost(post);

    if (!newPostId) {
      throw new InternalServerErrorException('Something went wrong');
    }

    return newPostId;
  }
}
