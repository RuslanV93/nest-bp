import {
  ApiExtraModels,
  ApiOkResponse,
  ApiQuery,
  getSchemaPath,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { PaginatedViewDto } from '../src/core/dto/base.paginated.view-dto';

export function ApiPaginatedResponse(model: any) {
  return applyDecorators(
    ApiExtraModels(PaginatedViewDto, model), // Добавляем модели в документацию

    ApiOkResponse({
      schema: {
        type: 'object',
        properties: {
          totalCount: { type: 'number' },
          pagesCount: { type: 'number' },
          page: { type: 'number' },
          pageSize: { type: 'number' },
          items: {
            type: 'array',
            items: { $ref: getSchemaPath(model) },
          },
        },
      },
    }),
  );
}

export function ApiPaginationQueries(path?: string) {
  const decorators = [
    ApiQuery({
      name: 'sortBy',
      type: String,
      default: 'createdAt',
      required: false,
      description: 'Field to sort by',
      example: 'createdAt',
    }),
    ApiQuery({
      name: 'sortDirection',
      type: String,
      default: 'desc',
      required: false,
      enum: ['asc', 'desc'],
      example: 'desc',
    }),
    ApiQuery({
      name: 'pageNumber',
      default: 1,
      type: Number,
      required: false,
      example: 1,
    }),
    ApiQuery({
      name: 'pageSize',
      default: 10,
      type: Number,
      required: false,
      example: 10,
    }),
  ];

  switch (path) {
    case 'blogs': {
      decorators.unshift(
        ApiQuery({
          name: 'searchNameTerm',
          type: String,
          default: null,
          required: false,
          description: 'Search term for blog name',
        }),
      );
      break;
    }

    case 'users': {
      decorators.unshift(
        ApiQuery({
          name: 'searchLoginTerm',
          type: String,
          default: null,
          required: false,
          description: 'Search term for user login',
        }),
        ApiQuery({
          name: 'searchEmailTerm',
          type: String,
          default: null,
          required: false,
          description: 'Search term for user email',
        }),
      );
      break;
    }
    default:
      break;
  }
  return applyDecorators(...decorators);
}
