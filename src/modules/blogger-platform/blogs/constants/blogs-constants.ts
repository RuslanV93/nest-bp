import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ObjectId } from 'mongodb';
import { BlogsRepository } from '../infrastructure/repositories/blogs.repository';

export const blogNameConstraints = {
  minLength: 3,
  maxLength: 15,
};

export const blogDescriptionConstraints = {
  minLength: 1,
  maxLength: 500,
};

export const blogWebsiteUrlConstraints = {
  minLength: 4,
  maxLength: 100,
  pattern:
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
};

@ValidatorConstraint({ async: true })
export class BlogExistsValidator implements ValidatorConstraintInterface {
  constructor(private readonly blogsRepository: BlogsRepository) {}

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
