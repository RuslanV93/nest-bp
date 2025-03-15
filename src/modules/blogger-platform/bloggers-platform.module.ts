import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blogs/domain/blogs.model';
import { SuperAdminBlogsController } from './blogs/interface/super-admin.blogs.controller';
import { BlogsService } from './blogs/application/blogs.service';
import { BlogsRepository } from './blogs/infrastructure/repositories/blogs.repository';
import { BlogsQueryRepository } from './blogs/infrastructure/repositories/blogs.query-repository';
import { PostsController } from './posts/interface/posts.controller';
import { PostsService } from './posts/application/posts.service';
import { PostsRepository } from './posts/infrastructure/repositories/posts.repository';
import { PostsQueryRepository } from './posts/infrastructure/repositories/posts.query.repository';
import { Post, PostSchema } from './posts/domain/posts.model';
import { CommentsQueryRepository } from './comments/infrastructure/repositories/comments.query.repository';
import { CommentsController } from './comments/interface/comments.controller';
import { Comment, CommentSchema } from './comments/domain/comments.model';
import { CommentsService } from './comments/application/comments.service';
import { CommentsRepository } from './comments/infrastructure/repositories/comments.repository';
import {
  CommentLike,
  CommentLikeSchema,
} from './likes/domain/comments.likes.model';
import { PostLike, PostLikeSchema } from './likes/domain/posts.likes.model';
import { LikesRepository } from './likes/infrastructure/repositories/likes.repository';
import { LikesQueryRepository } from './likes/infrastructure/repositories/likes.query-repository';
import { LikesService } from './likes/application/like.service';
import { CreateCommentUseCase } from './comments/application/use-cases/create-comment.use-case';
import { DeleteCommentUseCase } from './comments/application/use-cases/delete-comment.use-case';
import { UpdateCommentUseCase } from './comments/application/use-cases/update-comment.use-case';
import { UpdateCommentLikeStatusUseCase } from './likes/application/use-cases/update.comment-like-status.use-case';
import { UpdatePostLikeStatusUseCase } from './likes/application/use-cases/update.post-like-status.use-case';
import { UsersAccountModule } from '../users-account/users-account.module';
import { BlogsSqlRepository } from './blogs/infrastructure/repositories/blogs.sql.repository';
import { BlogsSqlQueryRepository } from './blogs/infrastructure/repositories/blogs.sql.query-repository';
import { PostsSqlRepository } from './posts/infrastructure/repositories/posts.sql.repository';
import { PostsSqlQueryRepository } from './posts/infrastructure/repositories/posts.sql.query.repository';
import { CreatePostUseCase } from './posts/application/use-cases/create-post.use-case';
import { CreateBlogUseCase } from './blogs/application/use-cases/create-blog.use-case';
import { UpdateBlogUseCase } from './blogs/application/use-cases/update-blog.use-case';
import { UpdatePostUseCase } from './posts/application/use-cases/update-post.use-case';
import { DeletePostUseCase } from './posts/application/use-cases/delete-post.use-case';
import { DeleteBlogUseCase } from './blogs/application/use-cases/delete-blog.use-case';
import { PublicBlogsController } from './blogs/interface/public.blogs.controller';
import { BlogExistsValidator } from '../../core/decorators/validation/blog-exists.validator';
import { PostExistsPipe } from './comments/infrastructure/pipes/post.exists.pipe';

const postsUseCases = [CreatePostUseCase, UpdatePostUseCase, DeletePostUseCase];
const blogsUseCases = [CreateBlogUseCase, UpdateBlogUseCase, DeleteBlogUseCase];
const commentsUseCases = [
  CreateCommentUseCase,
  DeleteCommentUseCase,
  UpdateCommentUseCase,
];
const likesUseCases = [
  UpdateCommentLikeStatusUseCase,
  UpdatePostLikeStatusUseCase,
];
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: CommentLike.name, schema: CommentLikeSchema },
      { name: PostLike.name, schema: PostLikeSchema },
    ]),
    UsersAccountModule,
  ],
  controllers: [
    SuperAdminBlogsController,
    PublicBlogsController,
    PostsController,
    CommentsController,
  ],
  providers: [
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,
    BlogsSqlRepository,
    BlogsSqlQueryRepository,
    PostsService,
    PostsRepository,
    PostsQueryRepository,
    PostsSqlRepository,
    PostsSqlQueryRepository,
    CommentsService,
    CommentsRepository,
    CommentsQueryRepository,
    LikesService,
    LikesQueryRepository,
    LikesRepository,
    PostExistsPipe,
    {
      provide: BlogExistsValidator,

      useClass: BlogExistsValidator,
    },
    ...postsUseCases,
    ...blogsUseCases,
    ...commentsUseCases,
    ...likesUseCases,
  ],
})
export class BloggersPlatformModule {}
