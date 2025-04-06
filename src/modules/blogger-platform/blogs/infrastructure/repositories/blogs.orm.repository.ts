import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, InsertResult } from 'typeorm';
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
      .select('blog')
      .where('blog.deletedAt IS NULL')
      .andWhere('_id = :id', { id: id.toString() })
      .getOne();
  }
  async findOneOrNotFoundException(id: ObjectId) {
    const blog = await this.findOne(id);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    return blog;
  }
  async updateBlog(blog: Blog) {
    await this.entityManager
      .createQueryBuilder()
      .update(Blog)
      .set({
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
      })
      .where('_id = :id', { id: blog._id })
      .execute();
  }
  async createBlog(blog: Blog) {
    const result: InsertResult = await this.entityManager
      .createQueryBuilder()
      .insert()
      .into(Blog)
      .values({
        _id: blog._id,
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        isMembership: blog.isMembership,
      })
      .returning('_id')
      .execute();
    if (!result.identifiers.length) {
      throw new InternalServerErrorException();
    }
    return new ObjectId((result.identifiers[0] as { _id: string })._id);
  }

  async deleteBlog(blog: Blog) {
    console.log(blog._id);
    await this.entityManager
      .createQueryBuilder(Blog, 'blog')
      .update()
      .set({ deletedAt: new Date() })
      .where('_id = :id', { id: blog._id })
      .execute();
  }
}
