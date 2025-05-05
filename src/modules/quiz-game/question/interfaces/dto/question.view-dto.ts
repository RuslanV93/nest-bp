import { ApiProperty } from '@nestjs/swagger';
import { Question } from '../../domain/question.orm.domain';

export type QuestionFromSql = {
  id: number;
  body: string;
  correctAnswer: string[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export class QuestionViewDto {
  @ApiProperty() id: string;
  @ApiProperty() body: string;
  @ApiProperty() correctAnswers: string[];
  @ApiProperty() published: boolean;
  @ApiProperty() createdAt: string;
  @ApiProperty() updatedAt: string | null;

  public static mapToView(this: void, question: QuestionFromSql | Question) {
    const dto = new QuestionViewDto();
    dto.id = question.id.toString();
    dto.body = question.body;
    dto.correctAnswers = question.correctAnswer;
    dto.published = question.published;
    dto.createdAt = question.createdAt.toISOString();
    dto.updatedAt = question.updatedAt
      ? question.updatedAt.toISOString()
      : null;
    return dto;
  }
}
