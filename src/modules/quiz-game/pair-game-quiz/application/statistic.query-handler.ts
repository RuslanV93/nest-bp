import { QueryHandler } from '@nestjs/cqrs';
import { QuizGameQueryRepository } from '../infrastructure/repositories/quiz-game.query-repository';
import { NotFoundException } from '@nestjs/common';
import { StatisticsViewDto } from '../interfaces/dto/statistics.view-dto';

export class GetStatisticQuery {
  constructor(public userId: number) {}
}

@QueryHandler(GetStatisticQuery)
export class GetStatisticHandler {
  constructor(private readonly gameQueryRepository: QuizGameQueryRepository) {}
  async execute(query: GetStatisticQuery): Promise<StatisticsViewDto> {
    const stat = await this.gameQueryRepository.getStatisticByUserId(
      query.userId,
    );
    if (!stat) {
      throw new NotFoundException(query.userId);
    }
    return StatisticsViewDto.mapToView(stat);
  }
}
