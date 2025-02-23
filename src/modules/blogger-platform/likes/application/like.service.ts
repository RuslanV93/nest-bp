import { Injectable } from '@nestjs/common';
import { LikeStatus } from '../domain/dto/like.domain.dto';

@Injectable()
export class LikesService {
  constructor() {}
  calculateLikeCounterChange(oldStatus: LikeStatus, newStatus: LikeStatus) {
    switch (newStatus) {
      case LikeStatus.None:
        if (oldStatus === LikeStatus.Like) {
          //decrement likes
          return { like: -1, dislike: 0 };
        }
        if (oldStatus === LikeStatus.Dislike) {
          return { like: 0, dislike: -1 };
        }
        break;
      case LikeStatus.Like:
        if (oldStatus === LikeStatus.None) {
          return { like: 1, dislike: 0 };
        }
        if (oldStatus === LikeStatus.Dislike) {
          return { like: 1, dislike: -1 };
        }
        break;
      case LikeStatus.Dislike:
        if (oldStatus === LikeStatus.None) {
          return { like: 0, dislike: 1 };
        }
        if (oldStatus === LikeStatus.Like) {
          return { like: -1, dislike: 1 };
        }
        break;
    }
    return { like: 0, dislike: 0 };
  }
}
