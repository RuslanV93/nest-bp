import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from '../../question/domain/question.orm.domain';
import { Game } from './game.orm.domain';

@Entity()
export class GameQuestion {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Question)
  @JoinColumn({ name: 'question_id' })
  question: Question;
  @Column({ name: 'question_id' })
  questionId: number;

  @ManyToOne(() => Game)
  @JoinColumn({ name: 'game_id' })
  game: Game;
  @Column({ name: 'game_id' })
  gameId: number;

  static createInstance(question: Question, game: Game) {
    const gameQuestion = new this();
    gameQuestion.game = game;
    gameQuestion.question = question;
    return gameQuestion;
  }
}
