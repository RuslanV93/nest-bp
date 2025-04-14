import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetPostsQueryParams } from './dto/get-posts.query-params.input.dto';
import { PostInputDto } from './dto/post.input-dto';

import { GetCommentsQueryParams } from '../../comments/interface/dto/get-comments.query-params.input.dto';
import {
  ApiPaginatedResponse,
  ApiPaginationQueries,
} from '../../../../../swagger/swagger.decorator';
import { PostViewDto } from './dto/post.view-dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CommentViewDto } from '../../comments/interface/dto/comment.view-dto';
import { ObjectId } from 'mongodb';
import { ExtractUserFromRequest } from '../../../users-account/auth/guards/decorators/extract-user-from-request-decorator';
import { UserContextDto } from '../../../users-account/auth/guards/dto/user-context.dto';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../../users-account/auth/guards/bearer/jwt-auth-guard';
import { CommentInputDto } from '../../comments/interface/dto/comment.input-dto';
import { CreateCommentCommand } from '../../comments/application/use-cases/create-comment.use-case';
import { PostExistsPipe } from '../../comments/infrastructure/pipes/post.exists.pipe';
import { PostsOrmQueryRepository } from '../infrastructure/repositories/posts.orm.query-repository';
import { CommentsOrmQueryRepository } from '../../comments/infrastructure/repositories/comments.orm.query.repository';
import { LikeInputDto } from '../../comments/interface/dto/like.input-dto';
import { UpdatePostLikeStatusCommand } from '../../likes/application/use-cases/update.post-like-status.use-case';

/**
 * Posts Controller
 * Handles CRUD operations for blogs.
 * Supports fetching, creating, updating, and deleting blogs.
 */
@Controller('posts')
export class PublicPostsController {
  constructor(
    private readonly postsQueryRepository: PostsOrmQueryRepository,
    private readonly commentsQueryRepository: CommentsOrmQueryRepository,
    private readonly commandBus: CommandBus,
  ) {}

  /** Getting all posts. Using pagination and sort filters */

  @Get()
  @ApiPaginatedResponse(PostViewDto)
  @ApiPaginationQueries()
  @ApiOperation({
    summary: 'Gets all posts.',
  })
  async getPosts(
    @Query() query: GetPostsQueryParams,
    @ExtractUserFromRequest() user: UserContextDto,
  ) {
    const posts = await this.postsQueryRepository.getPosts(
      query,
      undefined,
      user.id,
    );
    if (!posts) {
      throw new InternalServerErrorException();
    }
    return posts;
  }

  /** Get one post using post id*/

  @Get(':id')
  @ApiResponse({ type: PostViewDto })
  @ApiOperation({
    summary: 'Gets post by id.',
  })
  async getPostById(
    @Param('id') id: ObjectId,
    @ExtractUserFromRequest() user: UserContextDto,
  ) {
    const post = await this.postsQueryRepository.getPostById(id, user.id);
    if (!post) {
      throw new NotFoundException('Post not Found.');
    }
    return post;
  }

  /** Get comments belongs to a post by post id*/
  @Get(':id/comments')
  @ApiPaginatedResponse(CommentViewDto)
  @ApiPaginationQueries()
  @ApiOperation({
    summary: 'Gets all comments.',
    description: 'Returns all comments for the post.',
  })
  async getCommentsByPostId(
    @Param('id', PostExistsPipe) id: ObjectId,
    @Query() query: GetCommentsQueryParams,
    @ExtractUserFromRequest() user: UserContextDto,
  ) {
    const comments = await this.commentsQueryRepository.getComments(
      query,
      id,
      user.id,
    );

    return comments;
  }

  /** Update Like Status. Update posts like counters */
  @Put(':id/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: LikeInputDto })
  @ApiOperation({
    summary: 'Update post like.',
  })
  async updateLikeStatus(
    @Param('id') id: ObjectId,
    @Body() body: LikeInputDto,
    @ExtractUserFromRequest() user: UserContextDto,
  ) {
    await this.commandBus.execute(
      new UpdatePostLikeStatusCommand(user.id, id, body.likeStatus),
    );
  }

  /** Create new comment to existing post */
  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  @ApiPaginatedResponse(CommentViewDto)
  @ApiOperation({
    summary: 'Create new comment',
    description: 'Create and returns a new comment.',
  })
  async createComment(
    @Param('id') id: ObjectId,
    @Body() body: CommentInputDto,
    @ExtractUserFromRequest() user: UserContextDto,
  ) {
    const newCommentId: ObjectId = await this.commandBus.execute(
      new CreateCommentCommand(body.content, user.id, id),
    );
    return await this.commentsQueryRepository.getCommentById(
      newCommentId,
      user.id,
    );
  }
}
