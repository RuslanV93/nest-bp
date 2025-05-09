import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../../users-account/users/domain/users.orm.domain';

@Entity()
export class Statistic {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
  @Column({ name: 'user_id' })
  userId: number;

  @Column()
  sumScore: number;

  @Column()
  avgScores: number;

  @Column()
  gamesCount: number;

  @Column()
  winsCount: number;

  @Column()
  lossesCount: number;

  @Column()
  drawsCount: number;
}
