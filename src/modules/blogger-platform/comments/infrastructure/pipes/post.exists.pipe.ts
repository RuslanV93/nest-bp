import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { PostsSqlRepository } from '../../../posts/infrastructure/repositories/posts.sql.repository';
import { ObjectId } from 'mongodb';

@Injectable()
export class PostExistsPipe implements PipeTransform {
  constructor(private readonly postsSqlRepository: PostsSqlRepository) {}
  async transform(value: any, metadata: ArgumentMetadata) {
    const postId = value instanceof ObjectId ? value : new ObjectId(value);

    await this.postsSqlRepository.findOneOrNotFoundException(postId);
    return value;
  }
}
