import { LikeStatus } from '../../domain/dto/like.domain.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ParentType } from '../../types/like.types';
import { LikesOrmRepository } from '../../infrastructure/repositories/likes.orm.repository';
import { LikeDislike } from '../../domain/like.orm.domain';
import { CommentsOrmRepository } from '../../../comments/infrastructure/repositories/comments.orm.repository';

export class UpdateCommentLikeStatusCommand {
  constructor(
    public userId: number,
    public commentId: number,
    public status: LikeStatus,
  ) {}
}

@CommandHandler(UpdateCommentLikeStatusCommand)
export class UpdateCommentLikeStatusUseCase
  implements ICommandHandler<UpdateCommentLikeStatusCommand>
{
  constructor(
    private readonly likesRepository: LikesOrmRepository,
    private readonly commentsRepository: CommentsOrmRepository,
  ) {}
  async execute(command: UpdateCommentLikeStatusCommand) {
    await this.commentsRepository.findOneAndNotFoundException(
      command.commentId,
    );
    const existingLike = await this.likesRepository.findLike(
      command.userId,
      command.commentId,
      ParentType.COMMENT,
    );
    if (!existingLike) {
      const like: LikeDislike = LikeDislike.createInstance(
        command.status,
        command.commentId,
        command.userId,
        ParentType.COMMENT,
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

// export class UpdateCommentLikeStatusUseCase
//   implements ICommandHandler<UpdateCommentLikeStatusCommand>
// {
//   constructor(
//     private readonly commentsRepository: CommentsRepository,
//     private readonly likesRepository: LikesRepository,
//     @InjectModel(CommentLike.name)
//     private readonly CommentLikeModel: CommentLikeModelType,
//     private readonly likesService: LikesService,
//   ) {}
//   async execute(command: UpdateCommentLikeStatusCommand) {
//     const comment = await this.commentsRepository.findOneAndNotFoundException(
//       command.commentId,
//     );
//
//     const existingLike: CommentLikeDocument | null =
//       await this.likesRepository.findCommentLike(
//         command.userId,
//         command.commentId,
//       );
//
//     if (!existingLike) {
//       const newLike = this.CommentLikeModel.createInstance({
//         parentId: command.commentId,
//         userId: command.userId,
//         status: command.status,
//       });
//       const likeAndDislikeCounters =
//         this.likesService.calculateLikeCounterChange(
//           LikeStatus.None,
//           command.status,
//         );
//       comment.updateLikesInfo(likeAndDislikeCounters);
//       await Promise.all([
//         this.commentsRepository.save(comment),
//         this.likesRepository.save(newLike),
//       ]);
//       return newLike;
//     }
//     if (existingLike.status === command.status) {
//       return existingLike;
//     }
//     const likeAndDislikeCounters = this.likesService.calculateLikeCounterChange(
//       existingLike.status,
//       command.status,
//     );
//     comment.updateLikesInfo(likeAndDislikeCounters);
//     existingLike.updateLikeStatus(command.status);
//     await Promise.all([
//       this.commentsRepository.save(comment),
//       this.likesRepository.save(existingLike),
//     ]);
//     return existingLike;
//   }
// }
