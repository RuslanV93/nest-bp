import { BaseSortDirectionParam } from '../../../../../core/dto/base.query-params.input-dto';

export enum GameSortBy {
  pairCreatedDate = 'pairCreatedDate',
  status = 'status',
}

export class GetGamesQueryParams extends BaseSortDirectionParam<GameSortBy> {
  sortBy = GameSortBy.pairCreatedDate;
}
