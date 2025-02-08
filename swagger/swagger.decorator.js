"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiPaginatedResponse = ApiPaginatedResponse;
exports.ApiPaginationQueries = ApiPaginationQueries;
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const base_paginated_view_dto_1 = require("../src/core/dto/base.paginated.view-dto");
function ApiPaginatedResponse(model) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(base_paginated_view_dto_1.PaginatedViewDto, model), (0, swagger_1.ApiOkResponse)({
        schema: {
            type: 'object',
            properties: {
                totalCount: { type: 'number' },
                pagesCount: { type: 'number' },
                page: { type: 'number' },
                pageSize: { type: 'number' },
                items: {
                    type: 'array',
                    items: { $ref: (0, swagger_1.getSchemaPath)(model) },
                },
            },
        },
    }));
}
function ApiPaginationQueries(path) {
    const decorators = [
        (0, swagger_1.ApiQuery)({
            name: 'sortBy',
            type: String,
            default: 'createdAt',
            required: false,
            description: 'Field to sort by',
            example: 'createdAt',
        }),
        (0, swagger_1.ApiQuery)({
            name: 'sortDirection',
            type: String,
            default: 'desc',
            required: false,
            enum: ['asc', 'desc'],
            example: 'desc',
        }),
        (0, swagger_1.ApiQuery)({
            name: 'pageNumber',
            default: 1,
            type: Number,
            required: false,
            example: 1,
        }),
        (0, swagger_1.ApiQuery)({
            name: 'pageSize',
            default: 10,
            type: Number,
            required: false,
            example: 10,
        }),
    ];
    switch (path) {
        case 'blogs': {
            decorators.unshift((0, swagger_1.ApiQuery)({
                name: 'searchNameTerm',
                type: String,
                default: null,
                required: false,
                description: 'Search term for blog name',
            }));
            break;
        }
        case 'users': {
            decorators.unshift((0, swagger_1.ApiQuery)({
                name: 'searchLoginTerm',
                type: String,
                default: null,
                required: false,
                description: 'Search term for user login',
            }), (0, swagger_1.ApiQuery)({
                name: 'searchEmailTerm',
                type: String,
                default: null,
                required: false,
                description: 'Search term for user email',
            }));
            break;
        }
        default:
            break;
    }
    return (0, common_1.applyDecorators)(...decorators);
}
//# sourceMappingURL=swagger.decorator.js.map