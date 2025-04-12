import { ObjectId } from 'mongodb';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenDomainException } from '../../../../../core/exceptions/domain-exception';
import { CommentsSqlRepository } from '../../infrastructure/repositories/comments.sql.repository';
import { SqlDomainComment } from '../../domain/comments.sql.domain';
import { CommentsOrmRepository } from '../../infrastructure/repositories/comments.orm.repository';
import { Comment } from '../../domain/comments.orm.domain';

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
  constructor(private readonly commentsRepository: CommentsOrmRepository) {}
  async execute(command: DeleteCommentCommand) {
    const comment: Comment =
      await this.commentsRepository.findOneAndNotFoundException(
        command.commentId,
      );
    if (comment.userId !== command.userId.toString()) {
      throw ForbiddenDomainException.create(
        'A comment can only be deleted by its owner.',
      );
    }
    await this.commentsRepository.deleteComment(comment);
  }
}
