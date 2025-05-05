import { ApiProperty } from '@nestjs/swagger';
import { AnswerStatus } from '../../types/answer.status.type';
import { GameAnswer } from '../../domain/answer.orm.domain';

export class AnswerViewDto {
  @ApiProperty() questionId: string;
  @ApiProperty() answerStatus: AnswerStatus;
  @ApiProperty() addedAt: string;

  static mapToView(answer: GameAnswer) {
    const dto = new AnswerViewDto();
    dto.questionId = answer.id.toString();
    dto.answerStatus = answer.status;
    dto.addedAt = answer.date.toISOString();
    return dto;
  }
}
