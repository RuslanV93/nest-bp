import { BaseSortDirectionParam } from '../../../../../core/dto/base.query-params.input-dto';

export enum UserSortBy {
  createdAt = 'createdAt',
  login = 'login',
  email = 'email',
}
export class GetUsersQueryParams extends BaseSortDirectionParam<UserSortBy> {
  sortBy = UserSortBy.createdAt;
  searchLoginTerm: string | null = null;
  searchEmailTerm: string | null = null;
}
