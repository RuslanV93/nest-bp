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
import { BadRequestDomainException } from '../../../../core/exceptions/domain-exception';

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

  answerQuestion(question: GameQuestion, answerText: string) {
    if (this.game.status !== GameStatusType.Active) {
      throw BadRequestDomainException.create(
        'Cannot answer: game is not active',
      );
    }
    if (this.gameId !== question.gameId) {
      throw BadRequestDomainException.create(
        'Question does not belong to this game',
      );
    }

    const existingAnswer = this.answers.find(
      (a) => a.gameQuestionId === question.id,
    );
    if (existingAnswer) {
      throw BadRequestDomainException.create(
        'Player already answered this question',
      );
    }
    const isCorrect = question.question.correctAnswer.includes(answerText);
    const gameAnswer: GameAnswer = GameAnswer.createInstance(
      this,
      question,
      isCorrect,
      answerText,
    );
    this.answers.push(gameAnswer);
    this.game.checkIsAllQuestionsAnswered();
    return gameAnswer;
  }
}
