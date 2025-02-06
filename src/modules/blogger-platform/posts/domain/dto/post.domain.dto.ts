import { ObjectId } from 'mongodb';
import { OmitType } from '@nestjs/mapped-types';

export class ExtendedLikesInfo {
  likesCount: number;
  dislikesCount: number;
}
export class PostDomainDto<T = string> {
  title: string;
  shortDescription: string;
  content: string;
  blogId: T;
  blogName: string;
  extendedLikesInfo: ExtendedLikesInfo;
}

export class PostUpdateDomainDto extends PostDomainDto<ObjectId> {}
