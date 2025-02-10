import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { CommentsService } from '../application/comments.service';
import { CommentsQueryRepository } from '../infrastructure/repositories/comments.query.repository';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CommentViewDto } from './dto/comment.view-dto';
import { ObjectIdValidationTransformationPipe } from '../../../../core/pipes/object-id.validation-transformation-pipe';
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
  @ApiResponse({ type: CommentViewDto })
  @ApiOperation({
    summary: 'Get a comment by id.',
  })
  async getCommentById(
    @Param('id', ObjectIdValidationTransformationPipe) id: string,
  ) {
    const comment = await this.postsQueryRepository.getCommentById(id);

    if (!comment) {
      throw new NotFoundException('Comment not Found');
    }
    return comment;
  }
}
