import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { QuestionInputDto } from '../interfaces/dto/question.input.dto';
import { GameQuestion } from '../../pair-game-quiz/domain/game-question.orm.domain';

@Entity()
export class Question {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  body: string;

  @Column('text', { array: true })
  correctAnswer: string[];

  @Column({ default: true })
  published: boolean;

  @OneToMany(() => GameQuestion, (gameQuestion) => gameQuestion.question)
  gameQuestions: GameQuestion[];

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true, default: null })
  updatedAt: Date | null;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @VersionColumn({ default: 1 })
  version: number;

  static createInstance(questionInputDto: QuestionInputDto) {
    const question = new this();
    question.body = questionInputDto.body;
    question.correctAnswer = questionInputDto.correctAnswers;
    question.updatedAt = null;
    return question;
  }
  updateQuestion(questionInputDto: QuestionInputDto) {
    this.body = questionInputDto.body;
    this.correctAnswer = questionInputDto.correctAnswers;
    this.updatedAt = new Date();
  }
  publishQuestion(publish: boolean) {
    this.published = publish;
    this.updatedAt = new Date();
  }
}
