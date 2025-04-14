import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { CommentModelType } from '../../domain/comments.model';
import { ObjectId } from 'mongodb';
import { UsersOrmRepository } from '../../../../users-account/users/infrastructure/repositories/users.orm.repository';
import { CommentsOrmRepository } from '../../infrastructure/repositories/comments.orm.repository';
import { PostsOrmRepository } from '../../../posts/infrastructure/repositories/posts.orm.repository';
import { Comment } from '../../domain/comments.orm.domain';

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

    const newComment = await this.commentsRepository.createComment(comment);

    return newComment?._id;
  }
}
