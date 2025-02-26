import { ObjectId } from 'mongodb';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../infrastructure/repositories/comments.repository';
import { ForbiddenDomainException } from '../../../../../core/exceptions/domain-exception';

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
  constructor(private readonly commentsRepository: CommentsRepository) {}
  async execute(command: DeleteCommentCommand) {
    const comment = await this.commentsRepository.findOneAndNotFoundException(
      command.commentId,
    );
    if (
      comment.commentatorInfo.userId.toString() !== command.userId.toString()
    ) {
      throw ForbiddenDomainException.create(
        'A comment can only be deleted by its owner.',
      );
    }
    comment.deleteComment();
    await this.commentsRepository.save(comment);
  }
}
