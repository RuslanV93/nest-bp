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
import { BadRequestDomainException } from '../../../../core/exceptions/domain-exception';

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
    game.questions = questions.map((question, index) => {
      return GameQuestion.createInstance(question, game, index);
    });
    game.players = [player];
    return game;
  }

  addSecondPlayer(user: User) {
    if (this.status !== GameStatusType.PendingSecondPlayer) {
      throw BadRequestDomainException.create(
        'Game is not waiting for a second player',
      );
    }
    if (this.players.length >= 2) {
      throw BadRequestDomainException.create(
        'Game already has correct number of players',
      );
    }
    if (this.players[0].id === user._id) {
      throw BadRequestDomainException.create('User already joined this game');
    }
  }
}
