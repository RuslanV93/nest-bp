import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { CommentModelType } from '../../domain/comments.model';
import { ObjectId } from 'mongodb';
import { Comment } from '../../domain/comments.model';
import { UsersSqlRepository } from '../../../../users-account/users/infrastructure/repositories/users.sql.repository';
import { CommentsSqlRepository } from '../../infrastructure/repositories/comments.sql.repository';
import { PostsSqlRepository } from '../../../posts/infrastructure/repositories/posts.sql.repository';
import { SqlDomainComment } from '../../domain/comments.sql.domain';
import { SqlDomainUser } from '../../../../users-account/users/domain/users.sql.domain';

export class CreateCommentCommand {
  constructor(
    public content: string,
    public userId: ObjectId,
    public postId: ObjectId,
  ) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(
    @InjectModel(Comment.name) private readonly CommentModel: CommentModelType,
    private readonly usersRepository: UsersSqlRepository,
    private readonly commentsRepository: CommentsSqlRepository,
    private readonly postsRepository: PostsSqlRepository,
  ) {}
  async execute(command: CreateCommentCommand) {
    await this.usersRepository.findOrNotFoundException(command.userId);

    await this.postsRepository.findOneOrNotFoundException(command.postId);

    const comment: SqlDomainComment = SqlDomainComment.createInstance(
      command.content,
      command.userId,
      command.postId,
    );

    const newComment = await this.commentsRepository.createComment(comment);
    return newComment?._id;
  }
}
