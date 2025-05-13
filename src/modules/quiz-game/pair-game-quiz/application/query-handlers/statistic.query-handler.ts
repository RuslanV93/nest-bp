import { QueryHandler } from '@nestjs/cqrs';
import { QuizGameQueryRepository } from '../../infrastructure/repositories/quiz-game.query-repository';
import { StatisticsViewDto } from '../../interfaces/dto/statistics.view-dto';

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
      return {
        sumScore: 0,
        avgScores: 0,
        gamesCount: 0,
        winsCount: 0,
        lossesCount: 0,
        drawsCount: 0,
      };
    }
    return StatisticsViewDto.mapToView(stat);
  }
}
