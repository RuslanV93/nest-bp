import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModelType } from '../domain/blogs.model';
import { BlogInputDto } from '../interface/dto/blog.input-dto';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ServiceResultObjectFactory } from '../../../../shared/utils/serviceResultObject';
import { ObjectId } from 'mongodb';
import { BlogsSqlRepository } from '../infrastructure/repositories/blogs.sql.repository';
import { SqlDomainBlog } from '../domain/blogs.sql.domain';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: BlogModelType,
    private readonly blogsRepository: BlogsSqlRepository,
  ) {}

  /** Create new blog */
  async createBlog(blogDto: BlogInputDto): Promise<ObjectId> {
    const blog = SqlDomainBlog.createInstance(blogDto);
    const newBlogId = await this.blogsRepository.createBlog(blog);
    if (!newBlogId) {
      throw new InternalServerErrorException(
        'Something went wrong creating blog',
      );
    }
    return newBlogId;
  }

  /** Update blog fields. Finding by blog id */
  async updateBlog(id: ObjectId, updateBlogDto: BlogInputDto) {
    const blog: SqlDomainBlog =
      await this.blogsRepository.findOneOrNotFoundException(id);
    blog.updateBlog(updateBlogDto);
    const blogId = await this.blogsRepository.updateBlog(blog);
    return ServiceResultObjectFactory.successResultObject(blogId);
  }

  /** Delete blog by id. Using soft delete */
  async deleteBlog(id: ObjectId) {
    const blog = await this.blogsRepository.findOneOrNotFoundException(id);
    blog.deleteBlog();
    await this.blogsRepository.deleteBlog(blog);
  }
}
