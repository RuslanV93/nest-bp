import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blogs/domain/blogs.model';
import { BlogsController } from './blogs/interface/blogs.controller';
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
import { BlogExistsValidator } from './blogs/constants/blogs-constants';

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
  controllers: [BlogsController, PostsController, CommentsController],
  providers: [
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,
    PostsService,
    PostsRepository,
    PostsQueryRepository,
    CommentsService,
    CommentsRepository,
    CommentsQueryRepository,
    LikesService,
    LikesQueryRepository,
    LikesRepository,
    {
      provide: BlogExistsValidator,

      useClass: BlogExistsValidator,
    },
    ...commentsUseCases,
    ...likesUseCases,
  ],
})
export class BloggersPlatformModule {}
