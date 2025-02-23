import { ObjectId } from 'mongodb';
import { LikeStatus } from '../../domain/dto/like.domain.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../../comments/infrastructure/repositories/comments.repository';
import { LikesRepository } from '../../infrastructure/repositories/likes.repository';
import { InjectModel } from '@nestjs/mongoose';
import {
  CommentLike,
  CommentLikeDocument,
  CommentLikeModelType,
} from '../../domain/comments.likes.model';
import { LikesService } from '../like.service';

export class UpdateCommentLikeStatusCommand {
  constructor(
    public userId: ObjectId,
    public commentId: ObjectId,
    public status: LikeStatus,
  ) {}
}

@CommandHandler(UpdateCommentLikeStatusCommand)
export class UpdateCommentLikeStatusUseCase
  implements ICommandHandler<UpdateCommentLikeStatusCommand>
{
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly likesRepository: LikesRepository,
    @InjectModel(CommentLike.name)
    private readonly CommentLikeModel: CommentLikeModelType,
    private readonly likesService: LikesService,
  ) {}
  async execute(command: UpdateCommentLikeStatusCommand) {
    const comment = await this.commentsRepository.findOneAndNotFoundException(
      command.commentId,
    );

    const existingLike: CommentLikeDocument | null =
      await this.likesRepository.findCommentLike(
        command.userId,
        command.commentId,
      );

    if (!existingLike) {
      const newLike = this.CommentLikeModel.createInstance({
        parentId: command.commentId,
        userId: command.userId,
        status: command.status,
      });
      const likeAndDislikeCounters =
        this.likesService.calculateLikeCounterChange(
          LikeStatus.None,
          command.status,
        );
      comment.updateLikesInfo(likeAndDislikeCounters);
      await Promise.all([
        this.commentsRepository.save(comment),
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
    comment.updateLikesInfo(likeAndDislikeCounters);
    existingLike.updateLikeStatus(command.status);
    await Promise.all([
      this.commentsRepository.save(comment),
      this.likesRepository.save(existingLike),
    ]);
    return existingLike;
  }
}
