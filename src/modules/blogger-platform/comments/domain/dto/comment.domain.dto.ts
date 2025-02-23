import { ObjectId } from 'mongodb';

export class CommentatorInfo<T = ObjectId> {
  userId: T;
  userLogin: string;
}
export class CommentDomainDto<T = ObjectId> {
  content: string;
  postId: ObjectId;
  commentatorInfo: CommentatorInfo<T>;
}

export class CommentUpdateDomainDto extends CommentDomainDto<ObjectId> {}
