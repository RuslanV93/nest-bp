import { BaseSortDirectionParam } from '../../../../../core/dto/base.query-params.input-dto';

export enum CommentsSortBy {
  createdAt = 'createdAt',
  login = 'login',
}

export class GetCommentsQueryParams extends BaseSortDirectionParam<CommentsSortBy> {
  sortBy = CommentsSortBy.createdAt;
  searchLoginTerm: string | null = null;
}
