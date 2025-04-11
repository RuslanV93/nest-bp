import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../../shared/types/base.entity.type';
import { User } from '../../../users-account/users/domain/users.orm.domain';
import { LikeStatus } from './dto/like.domain.dto';
import { Post } from '../../posts/domain/posts.orm.domain';
import { ParentType } from '../types/like.types';
import { ObjectId } from 'mongodb';
import { Comment } from '../../comments/domain/comments.orm.domain';

@Entity()
export class LikeDislike extends BaseEntity {
  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.like)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: LikeStatus, default: LikeStatus.None })
  status: LikeStatus;

  @Column({ nullable: true })
  postId: string | null;

  @Column({ nullable: true })
  commentId: string | null;

  @Column({ type: 'enum', enum: ParentType, nullable: false })
  parent: ParentType;

  @ManyToOne(() => Post, (post) => post.likes, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @ManyToOne(() => Comment, (comment) => comment.likes, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'comment_id' })
  comment: Comment;

  static createInstance(
    status: LikeStatus,
    parentId: ObjectId,
    userId: ObjectId,
    parent: ParentType,
  ) {
    const like = new this();
    const id = new ObjectId();

    like._id = id.toString();
    like.parent = parent;
    like.status = status;
    like.userId = userId.toString();
    if (parent === ParentType.POST) {
      like.postId = parentId.toString();
      like.commentId = null;
    } else if (parent === ParentType.COMMENT) {
      like.commentId = parentId.toString();
      like.postId = null;
    }

    return like;
  }

  updateStatus(newStatus: LikeStatus) {
    this.status = newStatus;
  }
}
