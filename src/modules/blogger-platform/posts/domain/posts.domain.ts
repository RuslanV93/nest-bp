import {
  ExtendedLikesInfo,
  PostDomainDto,
  PostUpdateDomainDto,
} from './dto/post.domain.dto';
import { PostInputDto } from '../interface/dto/post.input-dto';
import { ObjectId } from 'mongodb';

export class DomainPost {
  constructor(
    private title: string,
    private shortDescription: string,
    private content: string,
    private blogId: ObjectId,
    private blogName: string,
    private extendedLikesInfo: ExtendedLikesInfo,
  ) {}
  private validateFields(): void {}
  static create(
    title: string,
    shortDescription: string,
    content: string,
    blogId: ObjectId,
    blogName: string,
  ): DomainPost {
    const extendedLikesInfo: ExtendedLikesInfo = {
      likesCount: 0,
      dislikesCount: 0,
    };
    return new DomainPost(
      title,
      shortDescription,
      content,
      blogId,
      blogName,
      extendedLikesInfo,
    );
  }

  static update(
    currentPost: PostUpdateDomainDto,
    updatedDto: PostInputDto,
  ): DomainPost {
    return new DomainPost(
      updatedDto.title || currentPost.title,
      updatedDto.shortDescription || currentPost.shortDescription,
      updatedDto.content || currentPost.content,
      updatedDto.blogId || currentPost.blogId,
      currentPost.blogName || currentPost.blogName,
      currentPost.extendedLikesInfo,
    );
  }

  toSchema(): PostDomainDto {
    return {
      title: this.title,
      shortDescription: this.shortDescription,
      content: this.content,
      blogId: this.blogId,
      blogName: this.blogName,
      extendedLikesInfo: this.extendedLikesInfo,
    };
  }
}
