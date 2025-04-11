import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../../shared/types/base.entity.type';
import { User } from '../../../users-account/users/domain/users.orm.domain';
import { Post } from '../../posts/domain/posts.orm.domain';
import { LikeDislike } from '../../likes/domain/like.orm.domain';
import { ObjectId } from 'mongodb';

@Entity()
export class Comment extends BaseEntity {
  @Column()
  content: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'post_id' })
  postId: string;

  @ManyToOne(() => Post)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @OneToMany(() => LikeDislike, (like) => like.comment)
  likes: LikeDislike[];

  static createInstance(content: string, userId: ObjectId, postId: ObjectId) {
    const id = new ObjectId();
    const comment = new this();

    comment.content = content;
    comment.postId = postId.toString();
    comment.userId = userId.toString();
    comment._id = id.toString();
    return comment;
  }
  updateComment(content: string) {
    this.content = content;
  }
}
