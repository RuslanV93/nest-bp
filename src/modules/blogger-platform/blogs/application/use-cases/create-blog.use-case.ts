import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogInputDto } from '../../interface/dto/blog.input-dto';
import { BlogsSqlRepository } from '../../infrastructure/repositories/blogs.sql.repository';
import { SqlDomainBlog } from '../../domain/blogs.sql.domain';

import { InternalServerErrorException } from '@nestjs/common';
import { ObjectId } from 'mongodb';

export class CreateBlogCommand {
  constructor(public blogDto: BlogInputDto) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand> {
  constructor(private readonly blogsRepository: BlogsSqlRepository) {}
  async execute(command: CreateBlogCommand) {
    const blog = SqlDomainBlog.createInstance(command.blogDto);
    const newBlogId: ObjectId = await this.blogsRepository.createBlog(blog);
    if (!newBlogId) {
      throw new InternalServerErrorException();
    }
    return newBlogId;
  }
}
