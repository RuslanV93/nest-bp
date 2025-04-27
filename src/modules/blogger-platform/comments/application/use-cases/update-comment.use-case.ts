import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenDomainException } from '../../../../../core/exceptions/domain-exception';
import { CommentsOrmRepository } from '../../infrastructure/repositories/comments.orm.repository';
import { Comment } from '../../domain/comments.orm.domain';

export class UpdateCommentCommand {
  constructor(
    public id: number,
    public content: string,
    public userId: number,
  ) {}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentUseCase
  implements ICommandHandler<UpdateCommentCommand>
{
  constructor(private readonly commentsRepository: CommentsOrmRepository) {}
  async execute(command: UpdateCommentCommand) {
    const comment: Comment =
      await this.commentsRepository.findOneAndNotFoundException(command.id);

    if (comment.userId !== command.userId) {
      throw ForbiddenDomainException.create(
        'A comment can only be updated by its owner.',
      );
    }
    comment.updateComment(command.content);
    await this.commentsRepository.save(comment);
  }
}
