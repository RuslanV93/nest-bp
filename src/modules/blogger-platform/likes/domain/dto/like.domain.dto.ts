import { ObjectId } from 'mongodb';

export enum LikeStatus {
  Like = 'Like',
  Dislike = 'Dislike',
  None = 'None',
}
export class CommentLikeDomainDto {
  parentId: ObjectId;
  userId: ObjectId;
  status: LikeStatus;
}

export class PostLikeDomainDto {
  parentId: ObjectId;
  userId: ObjectId;
  login: string;
  status: LikeStatus;
}
