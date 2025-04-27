import { BlogInputDto } from '../../interface/dto/blog.input-dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsOrmRepository } from '../../infrastructure/repositories/blogs.orm.repository';
import { Blog } from '../../domain/blogs.orm.domain';

export class UpdateBlogCommand {
  constructor(
    public id: number,
    public updateBlogDto: BlogInputDto,
  ) {}
}
@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand> {
  constructor(private readonly blogsRepository: BlogsOrmRepository) {}
  async execute(command: UpdateBlogCommand) {
    const blog: Blog = await this.blogsRepository.findOneOrNotFoundException(
      command.id,
    );
    blog.updateBlog(command.updateBlogDto);
    await this.blogsRepository.updateBlog(blog);
  }
}
