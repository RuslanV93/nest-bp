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
} from '@nestjs/common';
import { PostsService } from '../application/posts.service';
import { PostsQueryRepository } from '../infrastructure/repositories/posts.query.repository';
import { CommentsQueryRepository } from '../../comments/infrastructure/repositories/comments.query.repository';
import { GetPostsQueryParams } from './dto/get-posts.query-params.input.dto';
import { PostInputDto, PostUpdateInputDto } from './dto/post.input-dto';
import {
  DomainStatusCode,
  ResultObject,
} from '../../../../shared/types/serviceResultObjectType';
import { GetCommentsQueryParams } from '../../comments/interface/dto/get-comments.query-params.input.dto';
import {
  ApiPaginatedResponse,
  ApiPaginationQueries,
} from '../../../../../swagger/swagger.decorator';
import { PostViewDto } from './dto/post.view-dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CommentViewDto } from '../../comments/interface/dto/comment.view-dto';

function isSuccess(result: ResultObject<any>): result is ResultObject<string> {
  return result.status === DomainStatusCode.Success && result.data !== null;
}
/**
 * Posts Controller
 * Handles CRUD operations for blogs.
 * Supports fetching, creating, updating, and deleting blogs.
 */
@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}

  /** Getting all posts. Using pagination and sort filters */

  @Get()
  @ApiPaginatedResponse(PostViewDto)
  @ApiPaginationQueries()
  @ApiOperation({
    summary: 'Gets all posts.',
  })
  async getPosts(@Query() query: GetPostsQueryParams) {
    const posts = await this.postsQueryRepository.getPosts(query);
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
  async getPostById(@Param('id') id: string) {
    const post = await this.postsQueryRepository.getPostById(id);
    if (!post) {
      throw new NotFoundException('Post not Found.');
    }
    return post;
  }

  /** Create new Post */
  @Post()
  @ApiResponse({ type: PostViewDto })
  @ApiBody({ type: PostInputDto })
  @ApiOperation({
    summary: 'Create new post.',
  })
  async createNewPost(@Body() body: PostInputDto) {
    const postCreateResult = await this.postsService.createPost(
      body.blogId,
      body,
    );
    if (!isSuccess(postCreateResult)) {
      throw new InternalServerErrorException(postCreateResult.extensions);
    }
    const newPost = await this.postsQueryRepository.getPostById(
      postCreateResult.data,
    );

    if (!newPost) {
      throw new InternalServerErrorException(postCreateResult.extensions);
    }
    return newPost;
  }

  /** Update post fields using post id*/
  @Put(':id')
  @ApiBody({ type: PostUpdateInputDto })
  @ApiOperation({
    summary: 'Update existing post fields.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(@Param('id') id: string, @Body() body: PostUpdateInputDto) {
    await this.postsService.updatePost(id, body);
  }
  /** Delete existing post by post id */
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete post by id.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('id') id: string) {
    const deleteResult = await this.postsService.deletePost(id);
    if (deleteResult.status !== DomainStatusCode.Success) {
      throw new InternalServerErrorException(deleteResult.extensions);
    }
    return deleteResult.status;
  }

  /** Getting comments by post id*/
  @Get(':id/comments')
  @ApiPaginatedResponse(CommentViewDto)
  @ApiPaginationQueries()
  @ApiOperation({
    summary: 'Gets all posts.',
    description: 'Returns all comments for the post.',
  })
  async getCommentsByPostId(
    @Param('id') id: string,
    @Query() query: GetCommentsQueryParams,
  ) {
    const comments = await this.commentsQueryRepository.getComments(query, id);
    if (!comments) {
      throw new InternalServerErrorException();
    }
    return comments;
  }
}
