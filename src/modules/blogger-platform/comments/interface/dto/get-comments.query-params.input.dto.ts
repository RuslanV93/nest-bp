import { BaseSortDirectionParam } from '../../../../../core/dto/base.query-params.input-dto';

export enum CommentsSortBy {
  login = 'login',
}

export class GetCommentsQueryParams extends BaseSortDirectionParam<CommentsSortBy> {
  sortBy = CommentsSortBy.login;
  searchLoginTerm: string | null = null;
}
