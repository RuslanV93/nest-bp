import { Module } from '@nestjs/common';
import { SuperAdminBlogsController } from './blogs/interface/super-admin.blogs.controller';
import { PublicPostsController } from './posts/interface/public.posts.controller';
import { CommentsController } from './comments/interface/comments.controller';
import { LikesService } from './likes/application/like.service';
import { CreateCommentUseCase } from './comments/application/use-cases/create-comment.use-case';
import { DeleteCommentUseCase } from './comments/application/use-cases/delete-comment.use-case';
import { UpdateCommentUseCase } from './comments/application/use-cases/update-comment.use-case';
import { UpdateCommentLikeStatusUseCase } from './likes/application/use-cases/update.comment-like-status.use-case';
import { UpdatePostLikeStatusUseCase } from './likes/application/use-cases/update.post-like-status.use-case';
import { UsersAccountModule } from '../users-account/users-account.module';
import { CreatePostUseCase } from './posts/application/use-cases/create-post.use-case';
import { CreateBlogUseCase } from './blogs/application/use-cases/create-blog.use-case';
import { UpdateBlogUseCase } from './blogs/application/use-cases/update-blog.use-case';
import { UpdatePostUseCase } from './posts/application/use-cases/update-post.use-case';
import { DeletePostUseCase } from './posts/application/use-cases/delete-post.use-case';
import { DeleteBlogUseCase } from './blogs/application/use-cases/delete-blog.use-case';
import { PublicBlogsController } from './blogs/interface/public.blogs.controller';
import { PostExistsPipe } from './comments/infrastructure/pipes/post.exists.pipe';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './blogs/domain/blogs.orm.domain';
import { BlogsOrmQueryRepository } from './blogs/infrastructure/repositories/blogs.orm.query-repository';
import { BlogsOrmRepository } from './blogs/infrastructure/repositories/blogs.orm.repository';
import { Post } from './posts/domain/posts.orm.domain';
import { LikeDislike } from './likes/domain/like.orm.domain';
import { PostsOrmQueryRepository } from './posts/infrastructure/repositories/posts.orm.query-repository';
import { PostsOrmRepository } from './posts/infrastructure/repositories/posts.orm.repository';
import { LikesOrmRepository } from './likes/infrastructure/repositories/likes.orm.repository';
import { SuperAdminPostsController } from './posts/interface/super-admin.posts.controller';
import { CommentsOrmRepository } from './comments/infrastructure/repositories/comments.orm.repository';
import { CommentsOrmQueryRepository } from './comments/infrastructure/repositories/comments.orm.query.repository';
import { Comment } from './comments/domain/comments.orm.domain';

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
    TypeOrmModule.forFeature([Blog, Post, Comment, LikeDislike]),
    // MongooseModule.forFeature([
    //   { name: BlogMongo.name, schema: BlogSchema },
    //   { name: PostMongo.name, schema: PostSchema },
    //   { name: MongoComment.name, schema: CommentSchema },
    //   { name: CommentLike.name, schema: CommentLikeSchema },
    //   { name: PostLike.name, schema: PostLikeSchema },
    // ]),
    UsersAccountModule,
  ],
  controllers: [
    SuperAdminBlogsController,
    SuperAdminPostsController,
    PublicBlogsController,
    PublicPostsController,
    CommentsController,
  ],
  providers: [
    BlogsOrmQueryRepository,
    BlogsOrmRepository,
    PostsOrmQueryRepository,
    PostsOrmRepository,
    CommentsOrmRepository,
    CommentsOrmQueryRepository,
    LikesService,
    LikesOrmRepository,
    PostExistsPipe,
    ...postsUseCases,
    ...blogsUseCases,
    ...commentsUseCases,
    ...likesUseCases,
  ],
})
export class BloggersPlatformModule {}
