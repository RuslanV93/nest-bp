import { ObjectId } from 'mongodb';
import { LikeStatus } from '../../../likes/domain/dto/like.domain.dto';

export class CommentatorInfo<T = ObjectId> {
  userId: T;
  userLogin: string;
}
export class CommentDomainDto<T = ObjectId> {
  content: string;
  postId: ObjectId;
  commentatorInfo: CommentatorInfo<T>;
}

export class CommentUpdateDomainDto extends CommentDomainDto<ObjectId> {}

export type CommentQueryResult = {
  totalCount: string;
  _id: number;
  content: string;
  userId: number;
  userLogin: string;
  createdAt: Date;
  likesCount: string;
  dislikesCount: string;
  myStatus: LikeStatus;
};
