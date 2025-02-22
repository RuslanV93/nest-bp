import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersQueryRepository } from '../infrastructure/repositories/users.query.repository';
import { UserInputDto } from './dto/userInputDto';
import { UsersService } from '../application/users.service';
import { ObjectId } from 'mongodb';
import {
  DomainStatusCode,
  ResultObject,
} from '../../../../shared/types/serviceResultObjectType';
import { GetUsersQueryParams } from './dto/get-users.query-params.input.dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { UserViewDto } from './dto/userViewDto';
import {
  ApiPaginatedResponse,
  ApiPaginationQueries,
} from '../../../../../swagger/swagger.decorator';
import {
  ApiBasicAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ObjectIdValidationTransformationPipe } from '../../../../core/pipes/object-id.validation-transformation-pipe';
import { BasicAuthGuard } from '../../auth/guards/basic/basic-strategy';

function isSuccess(result: ResultObject<any>): result is ResultObject<string> {
  return result.status === DomainStatusCode.Success && result.data !== null;
}

/** Users endpoint controller. Response to /users uri path. Have @get, @post, @delete methods. */
@Controller('users')
@UseGuards(BasicAuthGuard)
export class UsersController {
  constructor(
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly usersService: UsersService,
  ) {}

  /** Get all users using query pagination and sort parameters.
   Login, email and created at fields of users can be used as a search term. */
  @Get()
  @ApiBasicAuth('basicAuth')
  @ApiPaginatedResponse(UserViewDto)
  @ApiPaginationQueries('users')
  @ApiOperation({
    summary: 'Get all users.',
  })
  async getUsers(
    @Query() query: GetUsersQueryParams,
  ): Promise<PaginatedViewDto<UserViewDto[]>> {
    const users = await this.usersQueryRepository.getUsers(query);
    if (!users) {
      throw new InternalServerErrorException();
    }
    return users;
  }
  /** Create and return new user */
  @Post()
  @ApiResponse({ type: UserViewDto })
  @ApiBody({ type: UserInputDto })
  @ApiOperation({
    summary: 'Create new user',
  })
  async createNewUser(@Body() body: UserInputDto) {
    const userCreateResult: ResultObject<ObjectId | null> =
      await this.usersService.createUser(body);

    if (!isSuccess(userCreateResult)) {
      throw new InternalServerErrorException(userCreateResult.extensions);
    }
    const newUser = await this.usersQueryRepository.getUserById(
      userCreateResult.data,
    );
    if (!newUser) {
      throw new InternalServerErrorException(userCreateResult.extensions);
    }
    return newUser;
  }

  /**
   * Deletes a user by ID using soft deletion.
   * This method sets the `deletedAt` field, which is used as one of the filters in the `get` method.
   */
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete user',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUserById(
    @Param('id', ObjectIdValidationTransformationPipe) id: ObjectId,
  ) {
    const deleteResult = await this.usersService.deleteUser(id);
    if (deleteResult.status !== DomainStatusCode.Success) {
      throw new NotFoundException(deleteResult.extensions);
    }
    return deleteResult.data;
  }
}
