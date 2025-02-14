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
  UseFilters,
} from '@nestjs/common';
import { GetBlogsQueryParams } from './dto/get-blogs.query-params.input.dto';
import { BlogsQueryRepository } from '../infrastructure/repositories/blogs.query-repository';
import { BlogInputDto } from './dto/blog.input-dto';
import {
  DomainStatusCode,
  ResultObject,
} from '../../../../shared/types/serviceResultObjectType';
import { ObjectId } from 'mongodb';
import { BlogsService } from '../application/blogs.service';
import { PostsQueryRepository } from '../../posts/infrastructure/repositories/posts.query.repository';
import { GetPostsQueryParams } from '../../posts/interface/dto/get-posts.query-params.input.dto';
import { PostInputDto } from '../../posts/interface/dto/post.input-dto';
import { PostsService } from '../../posts/application/posts.service';
import { BlogViewDto } from './dto/blog.view-dto';
import {
  ApiPaginatedResponse,
  ApiPaginationQueries,
} from '../../../../../swagger/swagger.decorator';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PostViewDto } from '../../posts/interface/dto/post.view-dto';
import { ObjectIdValidationTransformationPipe } from '../../../../core/pipes/object-id.validation-transformation-pipe';
import { BaseExceptionFilter } from '../../../../core/exceptions/filters/base-exception.filter';
import { isValidObjectId } from 'mongoose';

function isSuccess(result: ResultObject<any>): result is ResultObject<string> {
  return result.status === DomainStatusCode.Success && result.data !== null;
}

/**
 * Blogs Controller
 * Handles CRUD operations for blogs.
 * Supports fetching, creating, updating, and deleting blogs.
 */
@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly blogsService: BlogsService,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly postsService: PostsService,
    private readonly postQueryRepository: PostsQueryRepository,
  ) {}

  /** Getting all blogs. Using pagination and search terms (blog name search term). */
  @Get()
  @ApiPaginatedResponse(BlogViewDto)
  @ApiPaginationQueries('blogs')
  @ApiOperation({
    summary: 'Get a list of blogs',
    description:
      'Fetches all blogs with optional query parameters for search, sorting, and pagination.',
  })
  async getBlogs(@Query() query: GetBlogsQueryParams) {
    const blogs = await this.blogsQueryRepository.getBlogs(query);
    if (!blogs) {
      throw new InternalServerErrorException();
    }
    return blogs;
  }

  /** Returns one blog by id */
  @Get(':id')
  @ApiResponse({ type: BlogViewDto })
  @ApiOperation({
    summary: 'Get 1 blog by id.',
  })
  async getBlogById(@Param('id') id: ObjectId) {
    const user = await this.blogsQueryRepository.getBlogById(id);
    if (!user) {
      throw new NotFoundException('Blog not found');
    }
    return user;
  }

  /** Create new blog */

  @Post()
  @ApiResponse({ type: BlogViewDto })
  @ApiBody({ type: BlogInputDto })
  @ApiOperation({
    summary: 'Creates new blog. Returns new created blog',
  })
  async createNewBlog(@Body() body: BlogInputDto) {
    const blogCreateResult: ResultObject<ObjectId | null> =
      await this.blogsService.createBlog(body);

    if (!isSuccess(blogCreateResult)) {
      throw new InternalServerErrorException(blogCreateResult.extensions);
    }
    const newUser = await this.blogsQueryRepository.getBlogById(
      blogCreateResult.data,
    );
    if (!newUser) {
      throw new InternalServerErrorException(blogCreateResult.extensions);
    }
    return newUser;
  }

  /** Update blog fields by blog id. */

  @Put(':id')
  @ApiBody({ type: BlogInputDto })
  @ApiOperation({
    summary: 'Update blog fields.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(
    @Param('id', ObjectIdValidationTransformationPipe) id: ObjectId,
    @Body() body: BlogInputDto,
  ) {
    await this.blogsService.updateBlog(id, body);
  }

  /** Delete blog by id. */
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete one blog by id.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(
    @Param('id', ObjectIdValidationTransformationPipe) id: ObjectId,
  ) {
    const deleteResult = await this.blogsService.deleteBlog(id);
    if (deleteResult.status !== DomainStatusCode.Success) {
      throw new NotFoundException(deleteResult.extensions);
    }
    return deleteResult.status;
  }

  /** Getting all posts by blog id. */
  @Get(':id/posts')
  @ApiPaginatedResponse(PostViewDto)
  @ApiOperation({
    summary: 'Get posts belonging to the blog by the blog ID.',
    description:
      'Fetches all posts by existing blog id with optional query parameters for search, sorting, and pagination.',
  })
  async getPostsByBlogId(
    @Param('id') id: ObjectId,
    @Query() query: GetPostsQueryParams,
  ) {
    await this.blogsQueryRepository.getBlogById(id);

    const posts = await this.postsQueryRepository.getPosts(query, id);
    if (!posts) {
      throw new InternalServerErrorException();
    }
    return posts;
  }

  /** Creating new Post by blog id in params. Using blogs endpoint */
  @Post(':id/posts')
  @ApiResponse({ type: PostViewDto })
  @ApiBody({ type: PostInputDto })
  @ApiOperation({
    summary: 'Create post using blogs uri',
    description:
      'Create and return one post to existing blog. Using blogs uri parameter. ',
  })
  async createPostByBlogId(
    @Param('id') id: ObjectId,
    @Body() body: PostInputDto,
  ) {
    const postCreateResult = await this.postsService.createPost(id, body);
    if (!isSuccess(postCreateResult)) {
      throw new NotFoundException(postCreateResult.extensions);
    }
    const newPost = await this.postQueryRepository.getPostById(
      postCreateResult.data,
    );
    if (!newPost) {
      throw new InternalServerErrorException(postCreateResult.extensions);
    }
    return newPost;
  }
}
