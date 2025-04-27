import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BazaEntity } from '../../../../shared/types/base.entity.type';
import { User } from '../../../users-account/users/domain/users.orm.domain';
import { Post } from '../../posts/domain/posts.orm.domain';
import { LikeDislike } from '../../likes/domain/like.orm.domain';

@Entity()
export class Comment extends BazaEntity {
  @Column()
  content: string;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'post_id' })
  postId: number;

  @ManyToOne(() => Post)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @OneToMany(() => LikeDislike, (like) => like.comment)
  likes: LikeDislike[];

  static createInstance(content: string, userId: number, postId: number) {
    const comment = new this();

    comment.content = content;
    comment.postId = postId;
    comment.userId = userId;
    return comment;
  }
  updateComment(content: string) {
    this.content = content;
  }
}
