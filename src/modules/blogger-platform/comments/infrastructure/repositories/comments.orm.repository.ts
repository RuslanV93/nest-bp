import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from '../../domain/comments.orm.domain';
import { Repository } from 'typeorm';
import { NotFoundDomainException } from '../../../../../core/exceptions/domain-exception';

@Injectable()
export class CommentsOrmRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
  ) {}
  async findOne(id: number) {
    return this.commentsRepository.findOne({
      where: { _id: id },
    });
  }
  async findOneAndNotFoundException(id: number) {
    const comment = await this.findOne(id);
    if (!comment) {
      throw NotFoundDomainException.create('Comment not found');
    }
    return comment;
  }
  async save(comment: Comment) {
    return this.commentsRepository.save(comment);
  }
  async createComment(comment: Comment) {
    const newComment = this.commentsRepository.create(comment);
    const createdComment = await this.save(newComment);
    return createdComment._id;
  }
  async deleteComment(comment: Comment) {
    await this.commentsRepository.softRemove(comment);
  }
}
