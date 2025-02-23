import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommentsQueryRepository } from '../infrastructure/repositories/comments.query.repository';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CommentViewDto } from './dto/comment.view-dto';
import { ObjectIdValidationTransformationPipe } from '../../../../core/pipes/object-id.validation-transformation-pipe';
import { ObjectId } from 'mongodb';
import { CommentInputDto } from './dto/comment.input-dto';
import { JwtAuthGuard } from '../../../users-account/auth/guards/bearer/jwt-auth-guard';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateCommentCommand } from '../application/use-cases/update-comment.use-case';
import { ExtractUserFromRequest } from '../../../users-account/auth/guards/decorators/extract-user-from-request-decorator';
import { UserContextDto } from '../../../users-account/auth/guards/dto/user-context.dto';
import { DeleteCommentCommand } from '../application/use-cases/delete-comment.use-case';
import { UpdateCommentLikeStatusCommand } from '../../likes/application/use-cases/update.comment-like-status.use-case';
import { LikeInputDto } from './dto/like.input-dto';

/**
 * Comments Controller
 * Handles CRUD operations for blogs.
 * Supports fetching, creating, updating, and deleting blogs.
 */
@Controller('comments')
export class CommentsController {
  constructor(
    private readonly postsQueryRepository: CommentsQueryRepository,
    private readonly commandBus: CommandBus,
  ) {}

  @Get(':id')
  @ApiResponse({ type: CommentViewDto })
  @ApiOperation({
    summary: 'Get a comment by id.',
  })
  async getCommentById(
    @Param('id', ObjectIdValidationTransformationPipe) id: ObjectId,
    @ExtractUserFromRequest() user: UserContextDto,
  ) {
    const comment = await this.postsQueryRepository.getCommentById(id, user.id);

    if (!comment) {
      throw new NotFoundException('Comment not Found');
    }
    return comment;
  }

  /* Update existing comment*/
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: CommentInputDto })
  @ApiOperation({
    summary: 'Update commentary.',
  })
  async updateComment(
    @Param('id', ObjectIdValidationTransformationPipe) id: ObjectId,
    @Body() body: CommentInputDto,
    @ExtractUserFromRequest() user: UserContextDto,
  ) {
    const userId = user.id;
    await this.commandBus.execute(
      new UpdateCommentCommand(id, body.content, userId),
    );
  }

  @Put(':id/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: LikeInputDto })
  @ApiOperation({
    summary: 'Update commentary like.',
  })
  /** Update Like Status. Update comments like counters */
  async updateLikeStatus(
    @Param('id', ObjectIdValidationTransformationPipe) id: ObjectId,
    @Body() body: LikeInputDto,
    @ExtractUserFromRequest() user: UserContextDto,
  ) {
    await this.commandBus.execute(
      new UpdateCommentLikeStatusCommand(user.id, id, body.likeStatus),
    );
  }

  /* Delete existing comment */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete 1 comment by id.' })
  async deleteComment(
    @Param('id', ObjectIdValidationTransformationPipe) id: ObjectId,
    @ExtractUserFromRequest() user: UserContextDto,
  ) {
    const userId = user.id;
    await this.commandBus.execute(new DeleteCommentCommand(id, userId));
  }
}
