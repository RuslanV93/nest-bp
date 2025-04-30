import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GameQuestion } from './game-question.orm.domain';
import { Player } from './player.orm.domain';
import { User } from '../../../users-account/users/domain/users.orm.domain';
import { Question } from '../../question/domain/question.orm.domain';

export enum GameStatusType {
  PendingSecondPlayer = 'PendingSecondPlayer',
  Active = 'Active',
  Finished = 'Finished',
}
@Entity()
export class Game {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @OneToMany(() => Player, (player) => player.game, {
    cascade: true,
    eager: true,
  })
  players: Player[];

  @OneToMany(() => GameQuestion, (gameQuestion) => gameQuestion.game, {
    cascade: true,
    eager: true,
  })
  questions: GameQuestion[];

  @Column({
    type: 'enum',
    enum: GameStatusType,
    default: GameStatusType.PendingSecondPlayer,
  })
  status: GameStatusType;

  @CreateDateColumn()
  pairCreatedDate: Date;

  @Column({ type: 'timestamp' })
  startGameDate: Date | null;

  @Column({ type: 'timestamp' })
  finishGameDate: Date | null;

  static createInstance(user: User, questions: Question[]) {
    const game = new this();
    const player = Player.createInstance(user, game);
    game.questions = questions.map((question) => {
      return GameQuestion.createInstance(question, game);
    });
    game.players = [player];
    return game;
  }
}
