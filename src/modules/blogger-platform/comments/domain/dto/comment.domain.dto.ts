import { ObjectId } from 'mongodb';

export class LikesInfo {
  likesCount: number;
  dislikesCount: number;
}
export class CommentatorInfo<T = string> {
  userId: T;
  userLogin: string;
}
export class CommentDomainDto<T = string> {
  content: string;
  commentatorInfo: CommentatorInfo<T>;
  likesInfo: LikesInfo;
}

export class CommentUpdateDomainDto extends CommentDomainDto<ObjectId> {}
