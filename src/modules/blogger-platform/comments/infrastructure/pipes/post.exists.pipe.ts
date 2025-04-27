import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { PostsOrmRepository } from '../../../posts/infrastructure/repositories/posts.orm.repository';

@Injectable()
export class PostExistsPipe implements PipeTransform {
  constructor(private readonly postsSqlRepository: PostsOrmRepository) {}
  async transform(value: any, metadata: ArgumentMetadata) {
    await this.postsSqlRepository.findOneAndNotFoundException(value);
    return value;
  }
}
