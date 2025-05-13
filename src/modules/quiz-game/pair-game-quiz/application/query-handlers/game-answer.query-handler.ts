import { QueryHandler } from '@nestjs/cqrs';
import { QuizGameQueryRepository } from '../../infrastructure/repositories/quiz-game.query-repository';
import { NotFoundException } from '@nestjs/common';
import { AnswerViewDto } from '../../interfaces/dto/answer.view-dto';

export class GameAnswerQuery {
  constructor(public answerId: number) {}
}

@QueryHandler(GameAnswerQuery)
export class GameAnswerHandler {
  constructor(private readonly gameQueryRepository: QuizGameQueryRepository) {}

  async execute(query: GameAnswerQuery) {
    const answer = await this.gameQueryRepository.getAnswer(query.answerId);
    if (!answer) {
      throw new NotFoundException('Answer not found');
    }
    return AnswerViewDto.mapToView(answer);
  }
}
