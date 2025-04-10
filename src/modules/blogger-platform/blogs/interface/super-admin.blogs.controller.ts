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
import { GetBlogsQueryParams } from './dto/get-blogs.query-params.input.dto';
import { BlogInputDto } from './dto/blog.input-dto';
import { ObjectId } from 'mongodb';
import { GetPostsQueryParams } from '../../posts/interface/dto/get-posts.query-params.input.dto';
import {
  PostInputDto,
  PostInputDtoWithoutBlogId,
} from '../../posts/interface/dto/post.input-dto';
import { BlogViewDto } from './dto/blog.view-dto';
import {
  ApiPaginatedResponse,
  ApiPaginationQueries,
} from '../../../../../swagger/swagger.decorator';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PostViewDto } from '../../posts/interface/dto/post.view-dto';
import { BasicAuthGuard } from '../../../users-account/auth/guards/basic/basic-strategy';
import { ExtractUserFromRequest } from '../../../users-account/auth/guards/decorators/extract-user-from-request-decorator';
import { UserContextDto } from '../../../users-account/auth/guards/dto/user-context.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBlogCommand } from '../application/use-cases/create-blog.use-case';
import { DeleteBlogCommand } from '../application/use-cases/delete-blog.use-case';
import { UpdateBlogCommand } from '../application/use-cases/update-blog.use-case';
import { UpdatePostCommand } from '../../posts/application/use-cases/update-post.use-case';
import { DeletePostCommand } from '../../posts/application/use-cases/delete-post.use-case';
import { CreatePostCommand } from '../../posts/application/use-cases/create-post.use-case';
import { BlogsOrmQueryRepository } from '../infrastructure/repositories/blogs.orm.query-repository';
import { PostsOrmQueryRepository } from '../../posts/infrastructure/repositories/posts.orm.query-repository';

/**
 * Blogs Controller
 * Handles CRUD operations for blogs.
 * Supports fetching, creating, updating, and deleting blogs.
 */
@Controller('sa/blogs')
export class SuperAdminBlogsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly postsQueryRepository: PostsOrmQueryRepository,
    private readonly blogsQueryRepository: BlogsOrmQueryRepository,
  ) {}

  /** Getting all blogs. Using pagination and search terms (blog name search term). */
  @Get()
  @UseGuards(BasicAuthGuard)
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
  @UseGuards(BasicAuthGuard)
  @ApiResponse({ type: BlogViewDto })
  @ApiOperation({
    summary: 'Get 1 blog by id.',
  })
  async getBlogById(@Param('id') id: ObjectId) {
    const blog = await this.blogsQueryRepository.getBlogById(id);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    return blog;
  }

  /** Create new blog */

  @Post()
  @UseGuards(BasicAuthGuard)
  @ApiResponse({ type: BlogViewDto })
  @ApiBody({ type: BlogInputDto })
  @ApiOperation({
    summary: 'Creates new blog. Returns new created blog',
  })
  async createNewBlog(@Body() body: BlogInputDto) {
    const newBlogId: ObjectId = await this.commandBus.execute(
      new CreateBlogCommand(body),
    );
    const newUser = await this.blogsQueryRepository.getBlogById(newBlogId);
    if (!newUser) {
      throw new InternalServerErrorException('Something went wrong');
    }
    return newUser;
  }

  /** Update blog fields by blog id. */

  @Put(':id')
  @UseGuards(BasicAuthGuard)
  @ApiBody({ type: BlogInputDto })
  @ApiOperation({
    summary: 'Update blog fields.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(@Param('id') id: ObjectId, @Body() body: BlogInputDto) {
    await this.commandBus.execute(new UpdateBlogCommand(id, body));
  }

  /** Delete blog by id. */
  @Delete(':id')
  @UseGuards(BasicAuthGuard)
  @ApiOperation({
    summary: 'Delete one blog by id.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(@Param('id') id: ObjectId) {
    await this.commandBus.execute(new DeleteBlogCommand(id));
  }

  /** Getting all posts by blog id. */
  @Get(':id/posts')
  @UseGuards(BasicAuthGuard)
  @ApiPaginatedResponse(PostViewDto)
  @ApiOperation({
    summary: 'Get posts belonging to the blog by the blog ID.',
    description:
      'Fetches all posts by existing blog id with optional query parameters for search, sorting, and pagination.',
  })
  async getPostsByBlogId(
    @Param('id') id: ObjectId,
    @Query() query: GetPostsQueryParams,
    @ExtractUserFromRequest() user: UserContextDto,
  ) {
    await this.blogsQueryRepository.getBlogById(id);
    const posts = await this.postsQueryRepository.getPosts(query, id, user.id);
    if (!posts) {
      throw new InternalServerErrorException();
    }
    return posts;
  }

  /** Creating new Post by blog id in params. Using blogs endpoint */
  @Post(':id/posts')
  @UseGuards(BasicAuthGuard)
  @ApiResponse({ type: PostViewDto })
  @ApiBody({ type: PostInputDto })
  @ApiOperation({
    summary: 'Create post using blogs uri',
    description:
      'Create and return one post to existing blog. Using blogs uri parameter. ',
  })
  async createPostByBlogId(
    @Param('id') id: ObjectId,
    @Body() body: PostInputDtoWithoutBlogId,
  ) {
    const postId: ObjectId = await this.commandBus.execute(
      new CreatePostCommand(id, body),
    );

    const newPost = await this.postsQueryRepository.getPostById(postId);
    if (!newPost) {
      throw new InternalServerErrorException();
    }
    return newPost;
  }

  /** Update posts fields using blogs endpoint */
  @Put(':blogId/posts/:postId')
  @UseGuards(BasicAuthGuard)
  @ApiBody({ type: PostInputDtoWithoutBlogId })
  @ApiOperation({
    summary: 'Update existing post fields by blog ID',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePostByBlogId(
    @Param('blogId') blogId: ObjectId,
    @Param('postId') postId: ObjectId,
    @Body() body: PostInputDtoWithoutBlogId,
  ) {
    await this.commandBus.execute(new UpdatePostCommand(postId, blogId, body));
  }

  /** Delete existing post using blogs endpoint*/
  @Delete(':blogId/posts/:id')
  @UseGuards(BasicAuthGuard)
  @ApiOperation({
    summary: 'Delete post by id.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePostByBlogId(
    @Param('id') id: ObjectId,
    @Param('blogId') blogId: ObjectId,
  ) {
    await this.commandBus.execute(new DeletePostCommand(id, blogId));
  }
}
