import { PostDocument } from '../../domain/posts.model';
import { ApiProperty } from '@nestjs/swagger';
import { PostLikeDocument } from '../../../likes/domain/posts.likes.model';
import { LikeStatus } from '../../../likes/domain/dto/like.domain.dto';

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
  public static mapToView(
    this: void,
    post: PostDocument,
    likeInfo: PostLikeDocument[] | null,
    newestLikesMap: Map<string, NewestLikesViewDto[]>,
  ) {
    const likesMap = new Map(
      likeInfo?.map((like) => {
        return [like.parentId.toString(), like.status];
      }) ?? [],
    );

    const dto = new PostViewDto();
    const postId = post._id.toString();

    dto.id = postId;
    dto.title = post.title;
    dto.shortDescription = post.shortDescription;
    dto.content = post.content;
    dto.blogId = post.blogId.toString();
    dto.blogName = post.blogName;
    dto.createdAt = post.createdAt.toISOString();
    dto.extendedLikesInfo = {
      likesCount: post.extendedLikesInfo.likesCount,
      dislikesCount: post.extendedLikesInfo.dislikesCount,
      myStatus: likesMap.get(postId) ?? LikeStatus.None,
      newestLikes: newestLikesMap.get(postId) ?? [],
    };
    return dto;
  }
}
