import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ObjectId } from 'mongodb';
import {
  PostInputDto,
  PostInputDtoWithoutBlogId,
} from '../../interface/dto/post.input-dto';
import { PostsSqlRepository } from '../../infrastructure/repositories/posts.sql.repository';
import { SqlDomainPost } from '../../domain/posts.sql.domain';
import { BlogsSqlRepository } from '../../../blogs/infrastructure/repositories/blogs.sql.repository';

export class UpdatePostCommand {
  constructor(
    public id: ObjectId,
    public blogId: ObjectId,
    public updatePostDto: PostInputDto | PostInputDtoWithoutBlogId,
  ) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase implements ICommandHandler<UpdatePostCommand> {
  constructor(
    private readonly postsRepository: PostsSqlRepository,
    private readonly blogsRepository: BlogsSqlRepository,
  ) {}
  async execute(command: UpdatePostCommand) {
    await this.blogsRepository.findOneOrNotFoundException(command.blogId);

    const post: SqlDomainPost =
      await this.postsRepository.findOneOrNotFoundException(command.id);
    post.updatePost(command.updatePostDto);
    await this.postsRepository.updatePost(post);
  }
}
