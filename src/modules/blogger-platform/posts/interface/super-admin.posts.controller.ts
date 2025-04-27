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
  ParseIntPipe,
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
import { PostExistsPipe } from '../../comments/infrastructure/pipes/post.exists.pipe';
import { PostsOrmQueryRepository } from '../infrastructure/repositories/posts.orm.query-repository';
import { DeletePostCommand } from '../application/use-cases/delete-post.use-case';
import { CommentsOrmQueryRepository } from '../../comments/infrastructure/repositories/comments.orm.query.repository';

/**
 * Posts Controller
 * Handles CRUD operations for blogs.
 * Supports fetching, creating, updating, and deleting blogs.
 */
@Controller('sa/posts')
export class SuperAdminPostsController {
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
    @Param('id', ParseIntPipe) id: number,
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
  async createNewPost(
    @Body() body: PostInputDto,
    @ExtractUserFromRequest()
    user: Nullable<UserContextDto>,
  ) {
    const postId: number = await this.commandBus.execute(
      new CreatePostCommand(body.blogId, body),
    );
    const newPost = await this.postsQueryRepository.getPostById(
      postId,
      user.id,
    );
    if (!newPost) {
      throw new InternalServerErrorException();
    }
    return newPost;
  }

  /** Update post fields using post id*/
  @Put(':id')
  @UseGuards(BasicAuthGuard)
  @ApiBody({ type: PostInputDto })
  @ApiOperation({
    summary: 'Update existing post fields.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: PostInputDto,
  ) {
    await this.commandBus.execute(new UpdatePostCommand(id, body.blogId, body));
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
    @Param('id', ParseIntPipe) id: number,
    @Body() body: LikeInputDto,
    @ExtractUserFromRequest() user: UserContextDto,
  ) {
    await this.commandBus.execute(
      new UpdatePostLikeStatusCommand(user.id, id, body.likeStatus),
    );
  }

  /** Delete existing post by post id */
  @Delete(':id')
  @UseGuards(BasicAuthGuard)
  @ApiOperation({
    summary: 'Delete post by id.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('id', ParseIntPipe) id: number) {
    const post = await this.postsQueryRepository.getPostById(id);
    if (!post) {
      throw new NotFoundException('Post not Found.');
    }
    await this.commandBus.execute(
      new DeletePostCommand(id, Number.parseInt(post?.blogId)),
    );
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
    @Param('id', PostExistsPipe) id: number,
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

  /** Create new comment to existing post*/
  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  @ApiPaginatedResponse(CommentViewDto)
  @ApiOperation({
    summary: 'Create new comment',
    description: 'Create and returns a new comment.',
  })
  async createComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CommentInputDto,
    @ExtractUserFromRequest() user: UserContextDto,
  ) {
    const newCommentId: number = await this.commandBus.execute(
      new CreateCommentCommand(body.content, user.id, id),
    );
    return await this.commentsQueryRepository.getCommentById(
      newCommentId,
      user.id,
    );
  }
}
