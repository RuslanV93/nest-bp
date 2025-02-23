import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { CommentModelType } from '../../domain/comments.model';
import { ObjectId } from 'mongodb';
import { UsersRepository } from '../../../../users-account/users/infrastructure/repositories/users.repository';
import { CommentsRepository } from '../../infrastructure/repositories/comments.repository';
import { Comment } from '../../domain/comments.model';
import { ImATeapotException } from '@nestjs/common';
import { PostsRepository } from '../../../posts/infrastructure/repositories/posts.repository';

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
    private readonly usersRepository: UsersRepository,
    private readonly commentsRepository: CommentsRepository,
    private readonly postsRepository: PostsRepository,
  ) {}
  async execute(command: CreateCommentCommand) {
    const user = await this.usersRepository.findOrNotFoundException(
      command.userId,
    );
    await this.postsRepository.findOneAndNotFoundException(command.postId);

    const comment = this.CommentModel.createInstance({
      content: command.content,
      postId: command.postId,
      commentatorInfo: { userId: command.userId, userLogin: user.login },
    });
    if (!comment) {
      throw new ImATeapotException();
    }
    const newComment = await this.commentsRepository.save(comment);
    return newComment._id;
  }
}
