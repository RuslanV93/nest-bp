import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../../shared/types/base.entity.type';
import { User } from '../../../users-account/users/domain/users.orm.domain';
import { LikeStatus } from './dto/like.domain.dto';
import { Post } from '../../posts/domain/posts.orm.domain';
import { ParentType } from '../types/like.types';
import { LikeInputDto } from '../../comments/interface/dto/like.input-dto';
import { ObjectId } from 'mongodb';

@Entity()
export class LikeDislike extends BaseEntity {
  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.like)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: LikeStatus, default: LikeStatus.None })
  status: LikeStatus;

  @Column()
  parentId: string;

  @Column({ type: 'enum', enum: ParentType, nullable: false })
  parent: ParentType;

  @ManyToOne(() => Post, (post) => post.likes, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'parent_id' })
  post: Post;

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
    like.parentId = parentId.toString();
    return like;
  }

  updateStatus(newStatus: LikeStatus) {
    this.status = newStatus;
  }
}
