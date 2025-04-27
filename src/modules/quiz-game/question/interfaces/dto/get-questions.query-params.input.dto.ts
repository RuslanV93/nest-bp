import { BaseSortDirectionParam } from '../../../../../core/dto/base.query-params.input-dto';

export enum QuestionSortBy {
  createdAt = 'createdAt',
}
export enum QuestionPublishedType {
  all = 'all',
  published = 'published',
  notPublished = 'notPublished',
}
export class GetQuestionsQueryParams extends BaseSortDirectionParam<QuestionSortBy> {
  sortBy = QuestionSortBy.createdAt;
  bodySearchTerm: string | null = null;
  publishedStatus: QuestionPublishedType | null = null;
}
