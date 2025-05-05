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
import {
  BadRequestDomainException,
  ForbiddenDomainException,
} from '../../../../core/exceptions/domain-exception';
import { GameAnswer } from './answer.orm.domain';
import { AnswerStatus } from '../types/answer.status.type';

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
  gameQuestions: GameQuestion[];

  @Column({
    type: 'enum',
    enum: GameStatusType,
    default: GameStatusType.PendingSecondPlayer,
  })
  status: GameStatusType;

  @CreateDateColumn()
  pairCreatedDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  startGameDate: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  finishGameDate: Date | null;

  static createInstance(user: User, questions: Question[]) {
    const game = new this();
    const player = Player.createInstance(user, game);
    game.gameQuestions = questions
      .sort((a, b) => a.id - b.id)
      .map((question, index) => {
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
    if (this.players[0].userId === user._id) {
      throw ForbiddenDomainException.create('User already joined this game');
    }
    const secondPlayer = Player.createInstance(user, this);
    this.players = [...this.players, secondPlayer];

    this.startGameDate = new Date();
    this.status = GameStatusType.Active;
    return secondPlayer;
  }
  finishGame() {
    const isAllQuestionsAnswered = this.checkIsAllQuestionsAnswered();
    if (isAllQuestionsAnswered) {
      this.setBonusPointForSpeed();
      this.status = GameStatusType.Finished;
      this.finishGameDate = new Date();
    }
  }
  setBonusPointForSpeed() {
    const player1 = this.players[0];
    const player2 = this.players[1];

    const player1Answers: GameAnswer[] = player1.answers;
    const player2Answers: GameAnswer[] = player2.answers;

    const player1GotCorrectAnswer = player1Answers.some(
      (a) => a.status === AnswerStatus.Correct,
    );
    const player2GotCorrectAnswer = player2Answers.some(
      (a) => a.status === AnswerStatus.Correct,
    );
    const player1AnswerTime =
      player1Answers.length > 0
        ? Math.max(...player1Answers.map((a) => a.date.getTime()))
        : Infinity;
    const player2AnswerTime =
      player2Answers.length > 0
        ? Math.max(...player2Answers.map((a) => a.date.getTime()))
        : Infinity;

    if (player1GotCorrectAnswer && player1AnswerTime < player2AnswerTime) {
      player1.addBonusPoint();
    } else if (
      player2GotCorrectAnswer &&
      player2AnswerTime < player1AnswerTime
    ) {
      player2.addBonusPoint();
    }
  }
  checkIsAllQuestionsAnswered() {
    return this.players.every(
      (p) => p.answers.length === this.gameQuestions.length,
    );
  }
}
