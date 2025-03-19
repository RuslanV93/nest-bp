import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { BlogsSqlRepository } from '../../../blogs/infrastructure/repositories/blogs.sql.repository';
import { ObjectId } from 'mongodb';

@Injectable()
export class BlogExistsPipe implements PipeTransform {
  constructor(private readonly blogsRepository: BlogsSqlRepository) {}
  async transform(value: any, metadata: ArgumentMetadata) {
    const blogId = value instanceof ObjectId ? value : new ObjectId(value);
    await this.blogsRepository.findOneOrNotFoundException(blogId);
    return value;
  }
}
