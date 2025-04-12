import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { PostsOrmRepository } from '../../../posts/infrastructure/repositories/posts.orm.repository';

@Injectable()
export class PostExistsPipe implements PipeTransform {
  constructor(private readonly postsSqlRepository: PostsOrmRepository) {}
  async transform(value: any, metadata: ArgumentMetadata) {
    const postId = value instanceof ObjectId ? value : new ObjectId(value);

    await this.postsSqlRepository.findOneAndNotFoundException(postId);
    return value;
  }
}
