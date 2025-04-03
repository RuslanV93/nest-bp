import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsSqlRepository } from '../../infrastructure/repositories/blogs.sql.repository';
import { ObjectId } from 'mongodb';
import { Blog } from '../../domain/blogs.orm.domain';
import { BlogsOrmRepository } from '../../infrastructure/repositories/blogs.orm.repository';

export class DeleteBlogCommand {
  constructor(public id: ObjectId) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase implements ICommandHandler<DeleteBlogCommand> {
  constructor(private readonly blogsRepository: BlogsOrmRepository) {}
  async execute(command: DeleteBlogCommand) {
    const blog: Blog = await this.blogsRepository.findOneOrNotFoundException(
      command.id,
    );

    await this.blogsRepository.deleteBlog(blog);
  }
}
