import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { BlogsSqlRepository } from '../../../modules/blogger-platform/blogs/infrastructure/repositories/blogs.sql.repository';
import { ObjectId } from 'mongodb';

@ValidatorConstraint({ async: true })
export class BlogExistsValidator implements ValidatorConstraintInterface {
  constructor(private readonly blogsRepository: BlogsSqlRepository) {}

  async validate(blogId: ObjectId) {
    try {
      const user = await this.blogsRepository.findOne(new ObjectId(blogId));

      return !!user;
    } catch {
      return false;
    }
  }

  defaultMessage() {
    return "Blog doesn't exist";
  }
}
