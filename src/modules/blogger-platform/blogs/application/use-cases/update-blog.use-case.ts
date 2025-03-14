import { ObjectId } from 'mongodb';
import { BlogInputDto } from '../../interface/dto/blog.input-dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsSqlRepository } from '../../infrastructure/repositories/blogs.sql.repository';
import { SqlDomainBlog } from '../../domain/blogs.sql.domain';

export class UpdateBlogCommand {
  constructor(
    public id: ObjectId,
    public updateBlogDto: BlogInputDto,
  ) {}
}
@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand> {
  constructor(private readonly blogsRepository: BlogsSqlRepository) {}
  async execute(command: UpdateBlogCommand) {
    const blog: SqlDomainBlog =
      await this.blogsRepository.findOneOrNotFoundException(command.id);
    blog.updateBlog(command.updateBlogDto);
    await this.blogsRepository.updateBlog(blog);
  }
}
