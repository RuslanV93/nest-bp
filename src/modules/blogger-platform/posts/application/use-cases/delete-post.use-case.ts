import { ObjectId } from 'mongodb';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsOrmRepository } from '../../infrastructure/repositories/posts.orm.repository';
import { BlogsOrmRepository } from '../../../blogs/infrastructure/repositories/blogs.orm.repository';
import { Post } from '../../domain/posts.orm.domain';

export class DeletePostCommand {
  constructor(
    public id: ObjectId,
    public blogId: ObjectId,
  ) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<DeletePostCommand> {
  constructor(
    private readonly postsRepository: PostsOrmRepository,
    private readonly blogsRepository: BlogsOrmRepository,
  ) {}
  async execute(command: DeletePostCommand) {
    await this.blogsRepository.findOneOrNotFoundException(command.blogId);
    const post: Post = await this.postsRepository.findOneAndNotFoundException(
      command.id,
    );

    await this.postsRepository.deletePost(post);
  }
}
