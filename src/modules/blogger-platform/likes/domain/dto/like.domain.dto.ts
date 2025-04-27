export enum LikeStatus {
  Like = 'Like',
  Dislike = 'Dislike',
  None = 'None',
}
export class CommentLikeDomainDto {
  parentId: number;
  userId: number;
  status: LikeStatus;
}

export class PostLikeDomainDto {
  parentId: number;
  userId: number;
  login: string;
  status: LikeStatus;
}
