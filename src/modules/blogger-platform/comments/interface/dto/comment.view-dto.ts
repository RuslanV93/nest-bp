import { CommentDocument } from '../../domain/comments.model';
import { ApiProperty } from '@nestjs/swagger';

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
  public static mapToView(
    this: void,
    comment: CommentDocument,
  ): CommentViewDto {
    const commentatorInfo: CommentatorInfo = {
      userId: comment.commentatorInfo.userId.toString(),
      userLogin: comment.commentatorInfo.userLogin,
    };
    const likesInfo: LikesInfo = {
      likesCount: comment.likesInfo.likesCount,
      dislikesCount: comment.likesInfo.dislikesCount,
      myStatus: 'None',
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
