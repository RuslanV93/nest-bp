import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { QuizGameQueryRepository } from '../../infrastructure/repositories/quiz-game.query-repository';
import { GetGamesQueryParams } from '../../interfaces/dto/get-games.query-params';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';

export class GetMyGamesQuery {
  constructor(
    public userId: number,
    public requestQuery: GetGamesQueryParams,
  ) {}
}

@QueryHandler(GetMyGamesQuery)
export class GetMyGamesHandler implements IQueryHandler<GetMyGamesQuery> {
  constructor(private readonly quizGameRepository: QuizGameQueryRepository) {}
  async execute(query: GetMyGamesQuery) {
    const requestQuery = query.requestQuery;
    const userId = query.userId;

    const { items, totalCount } =
      await this.quizGameRepository.getGamesByUserId(userId, requestQuery);

    return PaginatedViewDto.mapToView({
      items,
      page: requestQuery.pageNumber,
      size: requestQuery.pageSize,
      totalCount,
    });
  }
}
