import { ObjectId } from 'mongodb';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenDomainException } from '../../../../../core/exceptions/domain-exception';
import { CommentsSqlRepository } from '../../infrastructure/repositories/comments.sql.repository';
import { SqlDomainComment } from '../../domain/comments.sql.domain';

export class DeleteCommentCommand {
  constructor(
    public commentId: ObjectId,
    public userId: ObjectId,
  ) {}
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase
  implements ICommandHandler<DeleteCommentCommand>
{
  constructor(private readonly commentsRepository: CommentsSqlRepository) {}
  async execute(command: DeleteCommentCommand) {
    const comment: SqlDomainComment =
      await this.commentsRepository.findOneAndNotFoundException(
        command.commentId,
      );
    if (comment.userId !== command.userId.toString()) {
      throw ForbiddenDomainException.create(
        'A comment can only be deleted by its owner.',
      );
    }
    comment.deleteComment();
    await this.commentsRepository.deleteComment(comment);
  }
}
