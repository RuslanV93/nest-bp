import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../../users-account/users/domain/users.orm.domain';
import { Game, GameStatusType } from './game.orm.domain';
import { GameAnswer } from './answer.orm.domain';
import { GameQuestion } from './game-question.orm.domain';
import { ForbiddenDomainException } from '../../../../core/exceptions/domain-exception';

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

  @OneToMany(() => GameAnswer, (answer) => answer.player, {
    cascade: true,
  })
  answers: GameAnswer[];

  @Column({ default: 0 })
  score: number;

  get login(): string {
    return this.user.login;
  }

  static createInstance(user: User) {
    const player = new this();

    player.score = 0;
    player.answers = [];
    player.user = user;
    player.userId = user._id;
    player.score = 0;
    return player;
  }

  calculateScore() {
    return this.score;
  }

  answerQuestion(
    currentGame: Game,
    question: GameQuestion,
    answerText: string,
  ) {
    if (currentGame.status !== GameStatusType.Active) {
      throw ForbiddenDomainException.create(
        'Cannot answer: game is not active',
      );
    }
    if (this.gameId !== question.gameId) {
      throw ForbiddenDomainException.create(
        'Question does not belong to this game',
      );
    }

    const existingAnswer = this.answers.find(
      (a) => a.gameQuestionId === question.id,
    );
    if (existingAnswer) {
      throw ForbiddenDomainException.create(
        'Player already answered this question',
      );
    }
    const isCorrect = question.question.correctAnswer.includes(answerText);
    if (isCorrect) {
      this.increaseScore();
    }
    const gameAnswer: GameAnswer = GameAnswer.createInstance(
      this,
      question,
      isCorrect,
      answerText,
    );
    this.answers.push(gameAnswer);
    currentGame.checkIsAllQuestionsAnswered();
    return gameAnswer;
  }
  increaseScore(): void {
    this.score += 1;
  }

  addBonusPoint(): void {
    this.score += 1;
  }
}
