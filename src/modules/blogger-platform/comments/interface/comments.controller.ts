import { Controller, Get, NotFoundException, Param } from '@nestjs/common';

import { CommentsService } from '../application/comments.service';
import { CommentsQueryRepository } from '../infrastructure/repositories/comments.query.repository';
//
// function isSuccess(result: ResultObject<any>): result is ResultObject<string> {
//   return result.status === DomainStatusCode.Success && result.data !== null;
// }

/**
 * Comments Controller
 * Handles CRUD operations for blogs.
 * Supports fetching, creating, updating, and deleting blogs.
 */
@Controller('comments')
export class CommentsController {
  constructor(
    private readonly postsService: CommentsService,
    private readonly postsQueryRepository: CommentsQueryRepository,
  ) {}

  @Get('id')
  async getCommentById(@Param('id') id: string) {
    const comment = await this.postsQueryRepository.getCommentById(id);

    if (!comment) {
      throw new NotFoundException('Comment not Found');
    }
    return comment;
  }
}
