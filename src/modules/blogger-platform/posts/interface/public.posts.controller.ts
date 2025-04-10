import {
  Body,
  Controller,
  Delete,
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
import { LikeInputDto } from '../../comments/interface/dto/like.input-dto';
import { ExtractUserFromRequest } from '../../../users-account/auth/guards/decorators/extract-user-from-request-decorator';
import {
  Nullable,
  UserContextDto,
} from '../../../users-account/auth/guards/dto/user-context.dto';
import { CommandBus } from '@nestjs/cqrs';
import { UpdatePostLikeStatusCommand } from '../../likes/application/use-cases/update.post-like-status.use-case';
import { JwtAuthGuard } from '../../../users-account/auth/guards/bearer/jwt-auth-guard';
import { CommentInputDto } from '../../comments/interface/dto/comment.input-dto';
import { CreateCommentCommand } from '../../comments/application/use-cases/create-comment.use-case';
import { BasicAuthGuard } from '../../../users-account/auth/guards/basic/basic-strategy';
import { CreatePostCommand } from '../application/use-cases/create-post.use-case';
import { UpdatePostCommand } from '../application/use-cases/update-post.use-case';
import { DeletePostCommand } from '../application/use-cases/delete-post.use-case';
import { PostExistsPipe } from '../../comments/infrastructure/pipes/post.exists.pipe';
import { CommentsSqlQueryRepository } from '../../comments/infrastructure/repositories/comments.sql.query.repository';
import { PostsOrmQueryRepository } from '../infrastructure/repositories/posts.orm.query-repository';

/**
 * Posts Controller
 * Handles CRUD operations for blogs.
 * Supports fetching, creating, updating, and deleting blogs.
 */
@Controller('posts')
export class PublicPostsController {
  constructor(
    private readonly postsQueryRepository: PostsOrmQueryRepository,
    private readonly commentsQueryRepository: CommentsSqlQueryRepository,
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

  /** Create new Post */
  @Post()
  @UseGuards(BasicAuthGuard)
  @ApiResponse({ type: PostViewDto })
  @ApiBody({ type: PostInputDto })
  @ApiOperation({
    summary: 'Create new post.',
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
    if (!comments) {
      throw new InternalServerErrorException();
    }
    return comments;
  }
}
