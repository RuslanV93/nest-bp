import { CommentDocument } from '../../domain/comments.model';
import { ApiProperty } from '@nestjs/swagger';
import { CommentLikeDocument } from '../../../likes/domain/comments.likes.model';
import { LikeStatus } from '../../../likes/domain/dto/like.domain.dto';
import { CommentQueryResult } from '../../domain/dto/comment.domain.dto';

export class LikesInfo {
  @ApiProperty() likesCount: number;
  @ApiProperty() dislikesCount: number;
  @ApiProperty() myStatus: string;
}
export class CommentatorInfo {
  @ApiProperty() userId: string;
  @ApiProperty() userLogin: string;
}
export class CommentViewDto {
  @ApiProperty() id: string;
  @ApiProperty() content: string;
  @ApiProperty({ type: CommentatorInfo }) commentatorInfo: CommentatorInfo;
  @ApiProperty() createdAt: string;
  @ApiProperty({ type: LikesInfo }) likesInfo: LikesInfo;

  public static fromSqlMapToView(this: void, comment: CommentQueryResult) {
    const dto = new CommentViewDto();
    dto.id = comment._id;
    dto.content = comment.content;
    dto.createdAt = comment.createdAt.toISOString();

    dto.commentatorInfo = {
      userId: comment.userId,
      userLogin: comment.userLogin,
    };

    dto.likesInfo = {
      likesCount: parseInt(comment.likesCount),
      dislikesCount: parseInt(comment.dislikesCount),
      myStatus: comment.myStatus,
    };

    return dto;
  }
  public static mapToView(
    this: void,
    comment: CommentDocument,
    likeInfo: CommentLikeDocument[] | null,
  ): CommentViewDto {
    const likesMap = new Map(
      likeInfo?.map((like) => [like.parentId.toString(), like.status]) ?? [],
    );

    const commentatorInfo: CommentatorInfo = {
      userId: comment.commentatorInfo.userId.toString(),
      userLogin: comment.commentatorInfo.userLogin,
    };

    const likesInfo: LikesInfo = {
      likesCount: comment.likesInfo.likesCount,
      dislikesCount: comment.likesInfo.dislikesCount,
      myStatus: likesMap.get(comment._id.toString()) ?? LikeStatus.None,
    };
    return {
      id: comment._id.toString(),
      content: comment.content,
      commentatorInfo: commentatorInfo,
      createdAt: comment.createdAt.toISOString(),
      likesInfo: likesInfo,
    };
  }
}
