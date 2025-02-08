import { PostDocument } from '../../domain/posts.model';
import { ApiProperty } from '@nestjs/swagger';

export class NewestLikesViewDto {
  @ApiProperty() addedAt: string;
  @ApiProperty() userId: string;
  @ApiProperty() login: string;
}

export class ExtendedLikesInfoViewDto {
  @ApiProperty() likesCount: number;
  @ApiProperty() dislikesCount: number;
  @ApiProperty() myStatus: string;
  @ApiProperty({ type: NewestLikesViewDto }) newestLikes: NewestLikesViewDto[];
}

export class PostViewDto {
  @ApiProperty() id: string;
  @ApiProperty() title: string;
  @ApiProperty() shortDescription: string;
  @ApiProperty() content: string;
  @ApiProperty() blogId: string;
  @ApiProperty() blogName: string;
  @ApiProperty() createdAt: string;
  @ApiProperty({ type: ExtendedLikesInfoViewDto })
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
