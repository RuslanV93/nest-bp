import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BazaEntity } from '../../../../shared/types/base.entity.type';
import { User } from '../../../users-account/users/domain/users.orm.domain';
import { LikeStatus } from './dto/like.domain.dto';
import { Post } from '../../posts/domain/posts.orm.domain';
import { ParentType } from '../types/like.types';
import { Comment } from '../../comments/domain/comments.orm.domain';

@Entity()
export class LikeDislike extends BazaEntity {
  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.like)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: LikeStatus, default: LikeStatus.None })
  status: LikeStatus;

  @Column({ nullable: true })
  postId: number | null;

  @Column({ nullable: true })
  commentId: number | null;

  @Column({ type: 'enum', enum: ParentType, nullable: false })
  parent: ParentType;

  @ManyToOne(() => Post, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @ManyToOne(() => Comment, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'comment_id' })
  comment: Comment;

  static createInstance(
    status: LikeStatus,
    parentId: number,
    userId: number,
    parent: ParentType,
  ) {
    const like = new this();
    like.parent = parent;
    like.status = status;
    like.userId = userId;
    if (parent === ParentType.POST) {
      like.postId = parentId;
      like.commentId = null;
    } else if (parent === ParentType.COMMENT) {
      like.commentId = parentId;
      like.postId = null;
    }

    return like;
  }

  updateStatus(newStatus: LikeStatus) {
    this.status = newStatus;
  }
}
