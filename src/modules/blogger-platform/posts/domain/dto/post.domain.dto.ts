import { ObjectId } from 'mongodb';

export class ExtendedLikesInfo {
  likesCount: number;
  dislikesCount: number;
}
export class PostDomainDto<T = ObjectId> {
  title: string;
  shortDescription: string;
  content: string;
  blogId: T;
  blogName: string;
  extendedLikesInfo: ExtendedLikesInfo;
}

export class PostUpdateDomainDto extends PostDomainDto<ObjectId> {}
