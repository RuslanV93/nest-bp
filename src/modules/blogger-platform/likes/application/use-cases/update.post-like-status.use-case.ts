import { LikeStatus } from '../../domain/dto/like.domain.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ParentType } from '../../types/like.types';
import { LikesOrmRepository } from '../../infrastructure/repositories/likes.orm.repository';
import { LikeDislike } from '../../domain/like.orm.domain';
import { PostsOrmRepository } from '../../../posts/infrastructure/repositories/posts.orm.repository';

export class UpdatePostLikeStatusCommand {
  constructor(
    public userId: number,
    public postId: number,
    public status: LikeStatus,
  ) {}
}

@CommandHandler(UpdatePostLikeStatusCommand)
export class UpdatePostLikeStatusUseCase
  implements ICommandHandler<UpdatePostLikeStatusCommand>
{
  constructor(
    private readonly likesRepository: LikesOrmRepository,
    private readonly postsRepository: PostsOrmRepository,
  ) {}
  async execute(command: UpdatePostLikeStatusCommand) {
    await this.postsRepository.findOneAndNotFoundException(command.postId);
    const existingLike = await this.likesRepository.findLike(
      command.userId,
      command.postId,
      ParentType.POST,
    );
    if (!existingLike) {
      const like: LikeDislike = LikeDislike.createInstance(
        command.status,
        command.postId,
        command.userId,
        ParentType.POST,
      );
      await this.likesRepository.createLike(like);
      return;
    }
    if (existingLike.status === command.status) {
      return;
    }
    existingLike.updateStatus(command.status);
    await this.likesRepository.save(existingLike);
    return;
  }
}
// export class UpdatePostLikeStatusUseCase
//   implements ICommandHandler<UpdatePostLikeStatusCommand>
// {
//   constructor(
//     private readonly postsRepository: PostsRepository,
//     @InjectModel(PostLike.name)
//     private readonly PostLikeModel: PostLikeModelType,
//     private readonly likesRepository: LikesRepository,
//     private readonly likesService: LikesService,
//     private readonly usersRepository: UsersRepository,
//   ) {}
//
//   async execute(command: UpdatePostLikeStatusCommand) {
//     const post: PostDocument =
//       await this.postsRepository.findOneAndNotFoundException(command.postId);
//     const user = await this.usersRepository.findOrNotFoundException(
//       command.userId,
//     );
//     const existingLike = await this.likesRepository.findPostLike(
//       command.userId,
//       command.postId,
//     );
//
//     if (!existingLike) {
//       const newLike = this.PostLikeModel.createInstance({
//         parentId: command.postId,
//         userId: command.userId,
//         login: user.login,
//         status: command.status,
//       });
//       const likeAndDislikeCounters =
//         this.likesService.calculateLikeCounterChange(
//           LikeStatus.None,
//           command.status,
//         );
//       post.updateLikesInfo(likeAndDislikeCounters);
//       await Promise.all([
//         this.postsRepository.save(post),
//         this.likesRepository.save(newLike),
//       ]);
//       return newLike;
//     }
//
//     if (existingLike.status === command.status) {
//       return existingLike;
//     }
//     const likeAndDislikeCounters = this.likesService.calculateLikeCounterChange(
//       existingLike.status,
//       command.status,
//     );
//     post.updateLikesInfo(likeAndDislikeCounters);
//     existingLike.updateLikeStatus(command.status);
//     await Promise.all([
//       this.postsRepository.save(post),
//       this.likesRepository.save(existingLike),
//     ]);
//     return existingLike;
//   }
// }
