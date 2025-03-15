import {
  PostInputDto,
  PostInputDtoWithoutBlogId,
} from '../interface/dto/post.input-dto';
import { ObjectId } from 'mongodb';

export type PostSqlDtoType = {
  _id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
};
export class SqlDomainPost {
  _id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
  constructor(data: PostSqlDtoType) {
    this._id = data._id;
    this.title = data.title;
    this.shortDescription = data.shortDescription;
    this.content = data.content;
    this.blogId = data.blogId;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.deletedAt = data.deletedAt;
  }
  static fromSqlResult(sqlRow: PostSqlDtoType) {
    return new SqlDomainPost(sqlRow);
  }
  static createInstance(
    postInputDto: PostInputDto | PostInputDtoWithoutBlogId,
    blogId?: ObjectId,
  ) {
    const id = new ObjectId().toString();
    const post = new SqlDomainPost({
      _id: id,
      title: postInputDto.title,
      shortDescription: postInputDto.shortDescription,
      content: postInputDto.content,
      blogId:
        'blogId' in postInputDto
          ? postInputDto.blogId?.toString()
          : blogId!.toString(),
      createdAt: null,
      updatedAt: null,
      deletedAt: null,
    });
    return post;
  }
  deletePost() {
    this.deletedAt = new Date();
  }
  updatePost(updatePostDto: PostInputDto | PostInputDtoWithoutBlogId) {
    this.title = updatePostDto.title;
    this.shortDescription = updatePostDto.shortDescription;
    this.content = updatePostDto.content;
  }
}
