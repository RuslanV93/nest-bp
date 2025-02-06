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
import { GetBlogsQueryParams } from './dto/get-blogs.query-params.input.dto';
import { BlogsQueryRepository } from '../infrastructure/repositories/blogs.query-repository';
import { BlogInputDto, BlogUpdateInputDto } from './dto/blog.input-dto';
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
  async getBlogs(@Query() query: GetBlogsQueryParams) {
    const blogs = await this.blogsQueryRepository.getBlogs(query);
    if (!blogs) {
      throw new InternalServerErrorException();
    }
    return blogs;
  }

  /** Returns one blog by id */
  @Get(':id')
  async getBlogById(@Param('id') id: string) {
    const user = await this.blogsQueryRepository.getBlogById(id);
    if (!user) {
      throw new NotFoundException('Blog not found');
    }
    return user;
  }

  /** Create new blog */
  @Post()
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
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(@Param('id') id: string, @Body() body: BlogUpdateInputDto) {
    await this.blogsService.updateBlog(id, body);
  }

  /** Delete blog by id. */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(@Param('id') id: string) {
    const deleteResult = await this.blogsService.deleteBlog(id);
    if (deleteResult.status !== DomainStatusCode.Success) {
      throw new NotFoundException(deleteResult.extensions);
    }
    return deleteResult.status;
  }

  /** Getting all posts by blog id. */
  @Get(':id/posts')
  async getPostsByBlogId(
    @Param('id') id: string,
    @Query() query: GetPostsQueryParams,
  ) {
    const existingBlog = await this.blogsQueryRepository.getBlogById(id);
    if (!existingBlog) {
      throw new NotFoundException('Blog not found');
    }
    const posts = await this.postsQueryRepository.getPosts(query, id);
    if (!posts) {
      throw new InternalServerErrorException();
    }
    return posts;
  }

  /** Creating new Post by blog id in params. Using blogs endpoint */
  @Post(':id/posts')
  async createPostByBlogId(
    @Param('id') id: string,
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
