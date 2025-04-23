import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { QuestionInputDto } from '../interfaces/dto/question.input.dto';

@Entity()
export class Question {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  body: string;

  @Column('simple-array')
  correctAnswer: string[];

  @Column({ default: true })
  published: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @VersionColumn({ default: 1 })
  version: number;

  static createInstance(questionInputDto: QuestionInputDto) {
    const question = new this();
    question.body = questionInputDto.body;
    question.correctAnswer = questionInputDto.correctAnswers;

    return question;
  }
  updateQuestion(questionInputDto: QuestionInputDto) {
    this.body = questionInputDto.body;
    this.correctAnswer = questionInputDto.correctAnswers;
  }
  publishQuestion(publish: boolean) {
    this.published = publish;
  }
}
