import { LikeStatus } from '../domain/dto/like.domain.dto';

export type LikeSqlDtoType = {
  _id: number;
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
  userId: number;
  parent: ParentType;
  commentId?: number;
  postId?: number;
};
