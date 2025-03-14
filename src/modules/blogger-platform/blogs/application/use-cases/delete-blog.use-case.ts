import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsSqlRepository } from '../../infrastructure/repositories/blogs.sql.repository';
import { ObjectId } from 'mongodb';

export class DeleteBlogCommand {
  constructor(public id: ObjectId) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase implements ICommandHandler<DeleteBlogCommand> {
  constructor(private readonly blogsRepository: BlogsSqlRepository) {}
  async execute(command: DeleteBlogCommand) {
    const blog = await this.blogsRepository.findOneOrNotFoundException(
      command.id,
    );
    blog.deleteBlog();
    await this.blogsRepository.deleteBlog(blog);
  }
}
