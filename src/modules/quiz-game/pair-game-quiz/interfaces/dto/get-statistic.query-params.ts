import { PaginationParams } from '../../../../../core/dto/base.query-params.input-dto';
import { ArrayMaxSize, IsArray, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}
export enum StatisticSortBy {
  avgScores = 'avgScores',
  sumScore = 'sumScore',
  winsCount = 'winsCount',
  losesCount = 'lossesCount',
}

export class GetStatisticsQueryParams extends PaginationParams {
  @IsOptional()
  @ArrayMaxSize(10)
  @IsArray()
  @Transform(({ value }: { value: string[] | string | undefined }) => {
    if (!value || value.length === 0) {
      return ['avgScores desc', 'sumScore desc'];
    }
    if (typeof value === 'string') {
      return [value];
    }
    return value;
  })
  sort?: string[];

  get parsedSort(): { field: string; direction: SortDirection }[] {
    const defaultSort = [
      { field: 'avgScores', direction: SortDirection.DESC },
      { field: 'sumScore', direction: SortDirection.DESC },
    ];
    if (!this.sort || this.sort.length === 0) {
      return defaultSort;
    }
    const isValid = this.sort.every((sort) => {
      const [field, direction] = sort.split(' ');
      return (
        Object.values(StatisticSortBy).includes(field as StatisticSortBy) &&
        ['ASC', 'DESC'].includes(direction?.toUpperCase())
      );
    });

    if (!isValid) {
      return defaultSort;
    }

    return this.sort.map((sort) => {
      const [field, direction] = sort.split(' ');

      return {
        field,
        direction: direction.toUpperCase() as SortDirection,
      };
    });
  }
}
