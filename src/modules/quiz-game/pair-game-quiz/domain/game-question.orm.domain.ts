import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from '../../question/domain/question.orm.domain';
import { Game } from './game.orm.domain';
import { GameAnswer } from './answer.orm.domain';

@Entity()
export class GameQuestion {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Question)
  @JoinColumn({ name: 'question_id' })
  question: Question;
  @Column({ name: 'question_id' })
  questionId: number;

  @OneToMany(() => GameAnswer, (answer) => answer.gameQuestion)
  answers: GameAnswer[];

  @ManyToOne(() => Game)
  @JoinColumn({ name: 'game_id' })
  game: Game;
  @Column({ name: 'game_id' })
  gameId: number;

  @Column()
  order: number;
  static createInstance(question: Question, game: Game, order: number) {
    const gameQuestion = new this();
    gameQuestion.game = game;
    gameQuestion.question = question;
    gameQuestion.order = order;
    return gameQuestion;
  }
}
