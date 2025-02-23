import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';
import {
  Comment,
  CommentDocument,
  CommentModelType,
} from '../../domain/comments.model';
import { NotFoundDomainException } from '../../../../../core/exceptions/domain-exception';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: CommentModelType,
  ) {}
  async findOne(id: ObjectId): Promise<CommentDocument | null> {
    return this.commentModel.findOne({ _id: id, deletedAt: null });
  }
  async findOneAndNotFoundException(id: ObjectId) {
    const comment = await this.findOne(id);
    if (!comment) {
      throw NotFoundDomainException.create('Comment not found');
    }
    return comment;
  }
  async save(comment: CommentDocument) {
    const updatedComment = await comment.save();
    if (!updatedComment) {
      throw new InternalServerErrorException();
    }
    return updatedComment;
  }
}
