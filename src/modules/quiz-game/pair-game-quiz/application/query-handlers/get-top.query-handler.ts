import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { QuizGameQueryRepository } from '../../infrastructure/repositories/quiz-game.query-repository';
import { GetStatisticsQueryParams } from '../../interfaces/dto/get-statistic.query-params';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';

export class GetPlayersTopQuery {
  constructor(public queryParams: GetStatisticsQueryParams) {}
}

@QueryHandler(GetPlayersTopQuery)
export class GetPlayersTopHandler implements IQueryHandler<GetPlayersTopQuery> {
  constructor(private readonly gamesRepository: QuizGameQueryRepository) {}
  async execute(query: GetPlayersTopQuery) {
    try {
      const { items, totalCount } = await this.gamesRepository.getPlayersTop(
        query.queryParams,
      );
      return PaginatedViewDto.mapToView({
        items,
        page: query.queryParams.pageNumber,
        size: query.queryParams.pageSize,
        totalCount,
      });
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }
  }
}
