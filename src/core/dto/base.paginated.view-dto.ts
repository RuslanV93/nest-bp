import { ApiProperty } from '@nestjs/swagger';

export abstract class PaginatedViewDto<T> {
  @ApiProperty() pagesCount: number;
  @ApiProperty() page: number;
  @ApiProperty() pageSize: number;
  @ApiProperty() totalCount: number;
  @ApiProperty({ isArray: true, type: Object }) abstract items: T;

  static mapToView<T>(data: {
    items: T;
    page: number;
    size: number;
    totalCount: number;
  }): PaginatedViewDto<T> {
    return {
      pagesCount: Math.ceil(data.totalCount / data.size),
      page: data.page,
      pageSize: data.size,
      totalCount: data.totalCount,
      items: data.items,
    };
  }
}
