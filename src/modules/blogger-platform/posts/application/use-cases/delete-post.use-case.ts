import { ObjectId } from 'mongodb';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsSqlRepository } from '../../infrastructure/repositories/posts.sql.repository';
import { BlogsSqlRepository } from '../../../blogs/infrastructure/repositories/blogs.sql.repository';

export class DeletePostCommand {
  constructor(
    public id: ObjectId,
    public blogId: ObjectId,
  ) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<DeletePostCommand> {
  constructor(
    private readonly postsRepository: PostsSqlRepository,
    private readonly blogsRepository: BlogsSqlRepository,
  ) {}
  async execute(command: DeletePostCommand) {
    await this.blogsRepository.findOneOrNotFoundException(command.blogId);
    const post = await this.postsRepository.findOneOrNotFoundException(
      command.id,
    );

    post.deletePost();
    await this.postsRepository.deletePost(post);
  }
}
