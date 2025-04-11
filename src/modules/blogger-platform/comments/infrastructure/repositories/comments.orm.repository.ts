import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from '../../domain/comments.orm.domain';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { NotFoundDomainException } from '../../../../../core/exceptions/domain-exception';

@Injectable()
export class CommentsOrmRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
  ) {}
  async findOne(id: ObjectId) {
    return this.commentsRepository.findOne({
      where: { _id: id.toString() },
    });
  }
  async findOneAndNotFoundException(id: ObjectId) {
    const comment = await this.findOne(id);
    if (comment) {
      throw NotFoundDomainException.create('Comment not found');
    }
  }
  async save(comment: Comment) {
    return this.commentsRepository.save(comment);
  }
  async createComment(comment: Comment) {
    const newComment = this.commentsRepository.create(comment);
    const createdComment = await this.save(newComment);
    return new ObjectId(createdComment._id);
  }
}
