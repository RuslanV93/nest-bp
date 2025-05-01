import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from '../../question/domain/question.orm.domain';
import { Player } from './player.orm.domain';

export enum AnswerStatus {
  Correct = 'Correct',
  Incorrect = 'Incorrect',
}
@Entity()
export class GameAnswer {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @OneToOne(() => Question)
  @JoinColumn({ name: 'question_id' })
  question: Question;
  @Column({ name: 'question_id' })
  questionId: number;

  @ManyToOne(() => Player, (player) => player.answers)
  @JoinColumn({ name: 'player_id' })
  player: Player;
  @Column({ name: 'player_id' })
  playerId: number;

  @CreateDateColumn()
  date: Date;

  @Column({ type: 'enum', enum: AnswerStatus })
  status: AnswerStatus;
}
