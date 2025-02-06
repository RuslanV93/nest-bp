import { BaseSortDirectionParam } from '../../../../../core/dto/base.query-params.input-dto';

export enum BlogsSortBy {
  createdAt = 'createdAt',
  name = 'name',
  description = 'description',
}
export class GetBlogsQueryParams extends BaseSortDirectionParam<BlogsSortBy> {
  sortBy = BlogsSortBy.createdAt;
  searchNameTerm: string | null = null;
}
