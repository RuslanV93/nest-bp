import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ObjectId } from 'mongodb';
import {
  CommentsSqlDtoType,
  SqlDomainComment,
} from '../../domain/comments.sql.domain';

@Injectable()
export class CommentsSqlRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}
  /** Find one comment by id */
  async findOne(id: ObjectId) {
    const comment: CommentsSqlDtoType[] = await this.dataSource.query(
      `
    SELECT * FROM "COMMENTS"
    WHERE "_id" = $1;
    `,
      [id.toString()],
    );
    if (!comment.length) {
      return null;
    }
    return SqlDomainComment.fromSqlResult(comment[0]);
  }
  /** find one or throw exception(404) */
  async findOneAndNotFoundException(id: ObjectId) {
    const comment = await this.findOne(id);
    if (!comment) {
      throw new NotFoundException('Commentary not found.');
    }
    return comment;
  }

  /** Create new commentary*/
  async createComment(comment: SqlDomainComment) {
    const commentId: string[] = await this.dataSource.query(
      `
    INSERT INTO "COMMENTS" ("_id", "content", "postId", "commentatorId")
    VALUES ($1, $2, $3, $4)
    RETURNING "_id"
    `,
      [comment._id, comment.content, comment.postId, comment.commentatorId],
    );
    return new ObjectId(commentId[0]);
  }

  /** Update comments content */
  async updateComment(comment: SqlDomainComment) {
    await this.dataSource.query(
      `
    UPDATE "COMMENTS"
    SET "content" = $1
    WHERE "_id" = $2
    `,
      [comment.content, comment._id],
    );
  }
  /** Delete Comment using soft deletion */
  async deleteComment(comment: SqlDomainComment) {
    await this.dataSource.query(
      `
    UPDATE "COMMENTS"
    SET "deletedAt" = $1
    WHERE "_id" = $2
    `,
      [comment.deletedAt, comment._id],
    );
  }
}
