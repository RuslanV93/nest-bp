import { ObjectId } from 'mongodb';
import { LikeStatus } from '../../domain/dto/like.domain.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../../posts/infrastructure/repositories/posts.repository';
import { PostLike, PostLikeModelType } from '../../domain/posts.likes.model';
import { InjectModel } from '@nestjs/mongoose';
import { LikesRepository } from '../../infrastructure/repositories/likes.repository';
import { LikesService } from '../like.service';
import { PostDocument } from '../../../posts/domain/posts.model';
import { UsersRepository } from '../../../../users-account/users/infrastructure/repositories/users.repository';

export class UpdatePostLikeStatusCommand {
  constructor(
    public userId: ObjectId,
    public postId: ObjectId,
    public status: LikeStatus,
  ) {}
}

@CommandHandler(UpdatePostLikeStatusCommand)
export class UpdatePostLikeStatusUseCase
  implements ICommandHandler<UpdatePostLikeStatusCommand>
{
  constructor(
    private readonly postsRepository: PostsRepository,
    @InjectModel(PostLike.name)
    private readonly PostLikeModel: PostLikeModelType,
    private readonly likesRepository: LikesRepository,
    private readonly likesService: LikesService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(command: UpdatePostLikeStatusCommand) {
    const post: PostDocument =
      await this.postsRepository.findOneAndNotFoundException(command.postId);
    const user = await this.usersRepository.findOrNotFoundException(
      command.userId,
    );
    const existingLike = await this.likesRepository.findPostLike(
      command.userId,
      command.postId,
    );

    if (!existingLike) {
      const newLike = this.PostLikeModel.createInstance({
        parentId: command.postId,
        userId: command.userId,
        login: user.login,
        status: command.status,
      });
      const likeAndDislikeCounters =
        this.likesService.calculateLikeCounterChange(
          LikeStatus.None,
          command.status,
        );
      post.updateLikesInfo(likeAndDislikeCounters);
      await Promise.all([
        this.postsRepository.save(post),
        this.likesRepository.save(newLike),
      ]);
      return newLike;
    }

    if (existingLike.status === command.status) {
      return existingLike;
    }
    const likeAndDislikeCounters = this.likesService.calculateLikeCounterChange(
      existingLike.status,
      command.status,
    );
    post.updateLikesInfo(likeAndDislikeCounters);
    existingLike.updateLikeStatus(command.status);
    await Promise.all([
      this.postsRepository.save(post),
      this.likesRepository.save(existingLike),
    ]);
    return existingLike;
  }
}
