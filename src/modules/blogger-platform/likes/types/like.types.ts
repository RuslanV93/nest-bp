import { LikeStatus } from '../domain/dto/like.domain.dto';

export type LikeSqlDtoType = {
  _id: string;
  status: LikeStatus;
  parentId: string;
  userId: string;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export enum ParentType {
  POST = 'POST',
  COMMENT = 'COMMENT',
}
export type LikeWhereType = {
  userId: string;
  parent: ParentType;
  commentId?: string;
  postId?: string;
};
