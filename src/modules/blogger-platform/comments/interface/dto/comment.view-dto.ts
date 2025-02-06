import { CommentDocument } from '../../domain/comments.model';

export class LikesInfo {
  likesCount: number;
  dislikesCount: number;
  myStatus: string;
}
export class CommentatorInfo {
  userId: string;
  userLogin: string;
}
export class CommentViewDto {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfo;
  createdAt: string;
  likesInfo: LikesInfo;
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
