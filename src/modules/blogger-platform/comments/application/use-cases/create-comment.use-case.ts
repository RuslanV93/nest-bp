import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersOrmRepository } from '../../../../users-account/users/infrastructure/repositories/users.orm.repository';
import { CommentsOrmRepository } from '../../infrastructure/repositories/comments.orm.repository';
import { PostsOrmRepository } from '../../../posts/infrastructure/repositories/posts.orm.repository';
import { Comment } from '../../domain/comments.orm.domain';

export class CreateCommentCommand {
  constructor(
    public content: string,
    public userId: number,
    public postId: number,
  ) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(
    private readonly usersRepository: UsersOrmRepository,
    private readonly commentsRepository: CommentsOrmRepository,
    private readonly postsRepository: PostsOrmRepository,
  ) {}
  async execute(command: CreateCommentCommand) {
    await this.usersRepository.findOrNotFoundException(command.userId);

    await this.postsRepository.findOneAndNotFoundException(command.postId);

    const comment: Comment = Comment.createInstance(
      command.content,
      command.userId,
      command.postId,
    );
    return await this.commentsRepository.createComment(comment);
  }
}
