import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
export enum SortDirection {
  asc = 'asc',
  desc = 'desc',
}
class PaginationParams {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Transform(({ value }): number => (value <= 0 ? 1 : value))
  pageNumber: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Transform(({ value }): number => (value <= 0 ? 10 : value))
  pageSize: number = 10;
  calculateSkipParam() {
    return (this.pageNumber - 1) * this.pageSize;
  }
}

export abstract class BaseSortDirectionParam<T> extends PaginationParams {
  sortDirection: SortDirection = SortDirection.desc;
  abstract sortBy: T;
}
