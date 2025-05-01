import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../../users-account/users/domain/users.orm.domain';
import { Game } from './game.orm.domain';
import { GameAnswer } from './answer.orm.domain';

@Entity()
export class Player {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => Game)
  @JoinColumn({ name: 'game_id' })
  game: Game;

  @Column({ name: 'game_id' })
  gameId: number;

  @OneToMany(() => GameAnswer, (answer) => answer.player)
  answers: GameAnswer[];

  @Column({ default: 0 })
  score: number;

  get login(): string {
    return this.user.login;
  }

  static createInstance(user: User, game: Game) {
    const player = new this();
    player.user = user;
    player.game = game;
    player.score = 0;
    return player;
  }
}
