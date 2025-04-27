import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogInputDto } from '../../interface/dto/blog.input-dto';
import { InternalServerErrorException } from '@nestjs/common';
import { BlogsOrmRepository } from '../../infrastructure/repositories/blogs.orm.repository';
import { Blog } from '../../domain/blogs.orm.domain';

export class CreateBlogCommand {
  constructor(public blogDto: BlogInputDto) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand> {
  constructor(private readonly blogsRepository: BlogsOrmRepository) {}
  async execute(command: CreateBlogCommand) {
    const blog = Blog.createInstance(command.blogDto);
    const newBlogId: number = await this.blogsRepository.createBlog(blog);
    if (!newBlogId) {
      throw new InternalServerErrorException();
    }
    return newBlogId;
  }
}
