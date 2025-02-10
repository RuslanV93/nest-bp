import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument, BlogModelType } from '../domain/blogs.model';
import { BlogsRepository } from '../infrastructure/repositories/blogs.repository';
import { BlogInputDto } from '../interface/dto/blog.input-dto';
import { Injectable } from '@nestjs/common';
import { DomainBlog } from '../domain/blogs.domain';
import { ServiceResultObjectFactory } from '../../../../shared/utils/serviceResultObject';
import { ObjectId } from 'mongodb';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: BlogModelType,
    private readonly blogsRepository: BlogsRepository,
  ) {}

  /** Create new blog */
  async createBlog(blogDto: BlogInputDto) {
    const blogEntity = DomainBlog.create(
      blogDto.name,
      blogDto.description,
      blogDto.websiteUrl,
    );
    const blog: BlogDocument = this.blogModel.createInstance(
      blogEntity.toSchema(),
    );
    const newBlogId = await this.blogsRepository.save(blog);
    if (!newBlogId) {
      return ServiceResultObjectFactory.internalErrorResultObject();
    }
    return ServiceResultObjectFactory.successResultObject(newBlogId);
  }

  /** Update blog fields. Finding by blog id */
  async updateBlog(id: ObjectId, updateBlogDto: BlogInputDto) {
    const blog = await this.blogsRepository.findOneOrNotFoundException(id);

    const newBlogEntity = DomainBlog.update(blog, updateBlogDto);
    blog.updateBlog(newBlogEntity.toSchema());
    const blogId = await this.blogsRepository.save(blog);
    return ServiceResultObjectFactory.successResultObject(blogId);
  }

  /** Delete blog by id. Using soft delete */
  async deleteBlog(id: ObjectId) {
    const blog = await this.blogsRepository.findOneOrNotFoundException(id);

    try {
      const deleteDate = blog.deleteBlog();
      await this.blogsRepository.save(blog);
      return ServiceResultObjectFactory.successResultObject(deleteDate);
    } catch (error) {
      return ServiceResultObjectFactory.notFoundResultObject({
        message: error instanceof Error ? error.message : 'Blog not found',
      });
    }
  }
}
