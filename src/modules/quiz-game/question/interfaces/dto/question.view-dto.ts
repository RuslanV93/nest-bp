import { ApiProperty } from '@nestjs/swagger';

export type QuestionFromSql = {
  id: string;
  body: string;
  correctAnswers: string[];
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
  @ApiProperty() updatedAt: string;

  public static mapToView(this: void, question: QuestionFromSql) {
    const dto = new QuestionViewDto();
    dto.id = question.id;
    dto.body = question.body;
    dto.correctAnswers = question.correctAnswers;
    dto.published = question.published;
    dto.createdAt = question.createdAt.toISOString();
    dto.updatedAt = question.updatedAt.toISOString();
    return dto;
  }
}
