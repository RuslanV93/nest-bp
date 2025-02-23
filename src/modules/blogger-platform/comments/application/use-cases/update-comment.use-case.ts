import { ObjectId } from 'mongodb';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentDocument } from '../../domain/comments.model';
import { CommentsRepository } from '../../infrastructure/repositories/comments.repository';
import { ForbiddenDomainException } from '../../../../../core/exceptions/domain-exception';

export class UpdateCommentCommand {
  constructor(
    public id: ObjectId,
    public content: string,
    public userId: ObjectId,
  ) {}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentUseCase
  implements ICommandHandler<UpdateCommentCommand>
{
  constructor(private readonly commentsRepository: CommentsRepository) {}
  async execute(command: UpdateCommentCommand) {
    const comment: CommentDocument =
      await this.commentsRepository.findOneAndNotFoundException(command.id);

    if (
      comment.commentatorInfo.userId.toString() !== command.userId.toString()
    ) {
      throw ForbiddenDomainException.create(
        'A comment can only be updated by its owner.',
      );
    }
    comment.updateComment(command.content);
    await this.commentsRepository.save(comment);
  }
}
