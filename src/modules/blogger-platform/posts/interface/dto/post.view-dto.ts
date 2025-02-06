import { PostDocument } from '../../domain/posts.model';

export class NewestLikesViewDto {
  addedAt: string;
  userId: string;
  login: string;
}

export class ExtendedLikesInfoViewDto {
  likesCount: number;
  'dislikesCount': number;
  'myStatus': string;
  'newestLikes': NewestLikesViewDto[];
}

export class PostViewDto {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: ExtendedLikesInfoViewDto;
  public static mapToView(this: void, post: PostDocument) {
    const dto = new PostViewDto();
    const extendedLikesInfo = {
      likesCount: post.extendedLikesInfo.likesCount,
      dislikesCount: post.extendedLikesInfo.dislikesCount,
      myStatus: 'None',
      newestLikes: [],
    };
    dto.id = post._id.toString();
    dto.title = post.title;
    dto.shortDescription = post.shortDescription;
    dto.content = post.content;
    dto.blogId = post.blogId.toString();
    dto.blogName = post.blogName;
    dto.createdAt = post.createdAt.toISOString();
    dto.extendedLikesInfo = extendedLikesInfo;
    return dto;
  }
}
