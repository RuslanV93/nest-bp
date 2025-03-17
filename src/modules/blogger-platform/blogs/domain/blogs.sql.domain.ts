import { BlogInputDto } from '../interface/dto/blog.input-dto';
import { ObjectId } from 'mongodb';

export type BlogsSqlEntityType = {
  _id: string;
  name: string;
  description: string;
  websiteUrl: string;
  isMembership: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
};

export class SqlDomainBlog {
  _id: string;
  name: string;
  description: string;
  websiteUrl: string;
  isMembership: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;

  constructor(data: BlogsSqlEntityType) {
    this._id = data._id;
    this.name = data.name;
    this.description = data.description;
    this.websiteUrl = data.websiteUrl;
    this.isMembership = data.isMembership;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.deletedAt = data.deletedAt;
  }

  static fromSqlResult(sqlRow: BlogsSqlEntityType) {
    return new SqlDomainBlog(sqlRow);
  }
  static createInstance(blogInputDto: BlogInputDto) {
    const id = new ObjectId().toString();
    const isMembership = false;
    const blog = new SqlDomainBlog({
      _id: id,
      name: blogInputDto.name,
      description: blogInputDto.description,
      websiteUrl: blogInputDto.websiteUrl,
      isMembership: isMembership,
      createdAt: null,
      updatedAt: null,
      deletedAt: null,
    });
    return blog;
  }
  deleteBlog() {
    this.deletedAt = new Date();
  }
  updateBlog(updateBlogDto: BlogInputDto) {
    this.name = updateBlogDto.name;
    this.description = updateBlogDto.description;
    this.websiteUrl = updateBlogDto.websiteUrl;
  }
}
