import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ObjectId } from 'mongodb';
import {
  PostInputDto,
  PostInputDtoWithoutBlogId,
} from '../../interface/dto/post.input-dto';
import { PostsOrmRepository } from '../../infrastructure/repositories/posts.orm.repository';
import { Post } from '../../domain/posts.orm.domain';
import { BlogsOrmRepository } from '../../../blogs/infrastructure/repositories/blogs.orm.repository';

export class UpdatePostCommand {
  constructor(
    public id: ObjectId,
    public blogId: ObjectId,
    public updatePostDto: PostInputDto | PostInputDtoWithoutBlogId,
  ) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase implements ICommandHandler<UpdatePostCommand> {
  constructor(
    private readonly postsRepository: PostsOrmRepository,
    private readonly blogsRepository: BlogsOrmRepository,
  ) {}
  async execute(command: UpdatePostCommand) {
    await this.blogsRepository.findOneOrNotFoundException(command.blogId);

    const post: Post = await this.postsRepository.findOneAndNotFoundException(
      command.id,
    );
    post.updatePost(command.updatePostDto);
    await this.postsRepository.save(post);
  }
}
