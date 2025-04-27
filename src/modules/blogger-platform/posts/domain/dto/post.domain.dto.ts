import { ObjectId } from 'mongodb';
import { LikeStatus } from '../../../likes/domain/dto/like.domain.dto';

export class ExtendedLikesInfo {
  likesCount: number;
  dislikesCount: number;
}
export class PostDomainDto<T = ObjectId> {
  title: string;
  shortDescription: string;
  content: string;
  blogId: T;
  blogName: string;
  extendedLikesInfo: ExtendedLikesInfo;
}

export class PostUpdateDomainDto extends PostDomainDto<ObjectId> {}

/** SQL TYPES */
export type NewestLikeType = {
  addedAt: Date | string;
  userId: number;
  login: string;
};
export type PostQueryResult = {
  totalCount: string;
  id: number;
  title: string;
  shortDescription: string;
  content: string;
  blogId: number;
  blogName: string;
  createdAt: Date;
  likesCount: string;
  dislikesCount: string;
  newestLikes: NewestLikeType[] | [];
  myStatus: LikeStatus;
};
