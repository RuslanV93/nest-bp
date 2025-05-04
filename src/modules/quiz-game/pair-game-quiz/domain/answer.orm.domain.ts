import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Player } from './player.orm.domain';
import { GameQuestion } from './game-question.orm.domain';

export enum AnswerStatus {
  Correct = 'Correct',
  Incorrect = 'Incorrect',
}
@Entity()
export class GameAnswer {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => GameQuestion)
  @JoinColumn({ name: 'question_id' })
  gameQuestion: GameQuestion;
  @Column({ name: 'question_id' })
  gameQuestionId: number;

  @ManyToOne(() => Player, (player) => player.answers)
  @JoinColumn({ name: 'player_id' })
  player: Player;
  @Column({ name: 'player_id' })
  playerId: number;

  @CreateDateColumn()
  date: Date;

  @Column({ type: 'enum', enum: AnswerStatus })
  status: AnswerStatus;

  @Column()
  answerText: string;

  static createInstance(
    player: Player,
    gameQuestion: GameQuestion,
    isCorrect: boolean,
    answerText: string,
  ) {
    const gameAnswer = new this();
    gameAnswer.gameQuestion = gameQuestion;
    gameAnswer.gameQuestionId = gameQuestion.id;
    gameAnswer.status = isCorrect
      ? AnswerStatus.Correct
      : AnswerStatus.Incorrect;
    gameAnswer.answerText = answerText;
    gameAnswer.player = player;
    gameAnswer.playerId = player.id;

    return gameAnswer;
  }
}
