import { Injectable } from '@nestjs/common';
import { CommentsRepository } from '../infrastructure/repositories/comments.repository';

@Injectable()
export class CommentsService {
  constructor(private readonly commentsRepository: CommentsRepository) {}
}
