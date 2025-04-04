import { ObjectId } from 'mongodb';
import { LikeStatus } from '../../domain/dto/like.domain.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikesSqlRepository } from '../../infrastructure/repositories/likes.sql.repository';
import { SqlDomainLike } from '../../domain/like.sql.domain';
import { PostsSqlRepository } from '../../../posts/infrastructure/repositories/posts.sql.repository';
import { ParentType } from '../../types/like.types';

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
    private readonly likesRepository: LikesSqlRepository,
    private readonly postsRepository: PostsSqlRepository,
  ) {}
  async execute(command: UpdatePostLikeStatusCommand) {
    await this.postsRepository.findOneOrNotFoundException(command.postId);
    const existingLike = await this.likesRepository.findLike(
      command.userId,
      command.postId,
      ParentType.POST,
    );
    if (!existingLike) {
      const like = SqlDomainLike.createInstance(
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
    await this.likesRepository.updateLike(existingLike);
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
