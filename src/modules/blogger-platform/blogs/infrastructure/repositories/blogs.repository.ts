import { Injectable, NotFoundException } from '@nestjs/common';
import { Blog, BlogDocument, BlogModelType } from '../../domain/blogs.model';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private blogModel: BlogModelType) {}
  async findOne(id: string): Promise<BlogDocument | null> {
    return this.blogModel.findOne({
      deletedAt: null,
      _id: new ObjectId(id),
    });
  }

  async findOneOrNotFoundException(id: string): Promise<BlogDocument> {
    const blog = await this.findOne(id);
    if (!blog) {
      throw new NotFoundException('Blog not Found');
    }
    return blog;
  }

  async save(blog: BlogDocument): Promise<ObjectId> {
    const newBlog = await blog.save();
    return newBlog._id;
  }
}
