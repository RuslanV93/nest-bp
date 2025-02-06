import { BaseSortDirectionParam } from '../../../../../core/dto/base.query-params.input-dto';

export enum PostsSortBy {
  createdAt = 'createdAt',
  title = 'title',
  shortDescription = 'shortDescription',
}

export class GetPostsQueryParams extends BaseSortDirectionParam<PostsSortBy> {
  sortBy = PostsSortBy.createdAt;
  searchTitleTerm: string | null = null;
}
