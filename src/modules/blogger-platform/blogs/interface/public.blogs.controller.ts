import {
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiPaginatedResponse,
  ApiPaginationQueries,
} from '../../../../../swagger/swagger.decorator';
import { BlogViewDto } from './dto/blog.view-dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetBlogsQueryParams } from './dto/get-blogs.query-params.input.dto';
import { PostViewDto } from '../../posts/interface/dto/post.view-dto';
import { GetPostsQueryParams } from '../../posts/interface/dto/get-posts.query-params.input.dto';
import { ExtractUserFromRequest } from '../../../users-account/auth/guards/decorators/extract-user-from-request-decorator';
import { UserContextDto } from '../../../users-account/auth/guards/dto/user-context.dto';
import { BlogsOrmQueryRepository } from '../infrastructure/repositories/blogs.orm.query-repository';
import { PostsOrmQueryRepository } from '../../posts/infrastructure/repositories/posts.orm.query-repository';

@Controller('blogs')
export class PublicBlogsController {
  constructor(
    private readonly blogsQueryRepository: BlogsOrmQueryRepository,
    private readonly postsQueryRepository: PostsOrmQueryRepository,
  ) {}
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
  @Get(':id')
  @ApiResponse({ type: BlogViewDto })
  @ApiOperation({
    summary: 'Get 1 blog by id.',
  })
  async getBlogById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.blogsQueryRepository.getBlogById(id);
    if (!user) {
      throw new NotFoundException('Blog not found');
    }
    return user;
  }

  @Get(':id/posts')
  @ApiPaginatedResponse(PostViewDto)
  @ApiOperation({
    summary: 'Get posts belonging to the blog by the blog ID.',
    description:
      'Fetches all posts by existing blog id with optional query parameters for search, sorting, and pagination.',
  })
  async getPostsByBlogId(
    @Param('id', ParseIntPipe) id: number,
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
}
