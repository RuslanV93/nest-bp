import { LikeStatus } from './dto/like.domain.dto';
import { LikeInputDto } from '../../comments/interface/dto/like.input-dto';
import { ObjectId } from 'mongodb';

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
export class SqlDomainLike {
  _id: string;
  status: LikeStatus;
  parentId: string;
  userId: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  readonly parentType: ParentType;

  constructor(data: LikeSqlDtoType, parentType: ParentType) {
    this._id = data._id;
    this.status = data.status;
    this.parentId = data.parentId;
    this.userId = data.userId;
    this.parentType = parentType;
  }

  static fromSqlResult(
    sqlRow: LikeSqlDtoType,
    parentType: ParentType,
  ): SqlDomainLike {
    return new SqlDomainLike(sqlRow, parentType);
  }
  static createInstance(
    likeStatus: LikeStatus,
    parentId: ObjectId,
    userId: ObjectId,
    parentType: ParentType,
  ): SqlDomainLike {
    const id = new ObjectId();
    const like = new SqlDomainLike(
      {
        _id: id.toString(),
        status: likeStatus,
        parentId: parentId.toString(),
        userId: userId.toString(),
        createdAt: null,
        updatedAt: null,
      },
      parentType,
    );
    return like;
  }
  updateStatus(newStatus: LikeStatus) {
    this.status = newStatus;
  }
}
