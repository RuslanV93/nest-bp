import { ObjectId } from 'mongodb';

export type CommentsSqlDtoType = {
  _id: string;
  content: string;
  postId: string;
  userId: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
};
export class SqlDomainComment {
  _id: string;
  content: string;
  postId: string;
  userId: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
  constructor(data: CommentsSqlDtoType) {
    this._id = data._id;
    this.content = data.content;
    this.postId = data.postId;
    this.userId = data.userId;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.deletedAt = data.deletedAt;
  }
  static fromSqlResult(sqlRow: CommentsSqlDtoType) {
    return new SqlDomainComment(sqlRow);
  }
  static createInstance(content: string, userId: ObjectId, postId: ObjectId) {
    const id = new ObjectId();
    const comment = new SqlDomainComment({
      _id: id.toString(),
      content: content,
      postId: postId.toString(),
      userId: userId.toString(),
      createdAt: null,
      updatedAt: null,
      deletedAt: null,
    });
    return comment;
  }
  updateComment(content: string) {
    this.content = content;
  }
  deleteComment() {
    this.deletedAt = new Date();
  }
}
