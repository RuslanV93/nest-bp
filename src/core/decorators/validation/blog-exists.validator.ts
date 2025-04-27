import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { BlogsOrmRepository } from '../../../modules/blogger-platform/blogs/infrastructure/repositories/blogs.orm.repository';

@ValidatorConstraint({ async: true })
export class BlogExistsValidator implements ValidatorConstraintInterface {
  constructor(private readonly blogsRepository: BlogsOrmRepository) {}

  async validate(blogId: number) {
    try {
      const user = await this.blogsRepository.findOne(blogId);

      return !!user;
    } catch {
      return false;
    }
  }

  defaultMessage() {
    return "Blog doesn't exist";
  }
}
