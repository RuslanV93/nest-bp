import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Blog } from '../../domain/blogs.orm.domain';

@Injectable()
export class BlogsOrmRepository {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}
  async findOne(id: ObjectId) {
    return this.entityManager
      .createQueryBuilder(Blog, 'blog')
      .select('*')
      .where('_id = :id', { id: id.toString() })
      .getOne();
  }
  async findOneOrNotFoundException(id: ObjectId) {
    const blog = await this.findOne(id);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    return blog;
  }
}
