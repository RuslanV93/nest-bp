import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserInputDto } from './dto/userInputDto';
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
import { BasicAuthGuard } from '../../auth/guards/basic/basic-strategy';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../application/users-use-cases/create-user.use-case';
import { DeleteUserCommand } from '../application/users-use-cases/delete-user.use-case';
import { UsersOrmQueryRepository } from '../infrastructure/repositories/users.orm.query.repository';

function isSuccess(result: ResultObject<any>): result is ResultObject<string> {
  return result.status === DomainStatusCode.Success && result.data !== null;
}

/** Users endpoint controller. Response to /users uri path. Have @get, @post, @delete methods. */
@Controller('sa/users')
@UseGuards(BasicAuthGuard)
export class UsersController {
  constructor(
    private readonly usersQueryRepository: UsersOrmQueryRepository,

    private readonly commandBus: CommandBus,
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
  @ApiBasicAuth()
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
  @ApiBasicAuth()
  async createNewUser(@Body() body: UserInputDto) {
    const userCreateResult: ResultObject<{ newUserId: number } | null> =
      await this.commandBus.execute(new CreateUserCommand(body));
    if (!isSuccess(userCreateResult)) {
      throw new InternalServerErrorException(userCreateResult.extensions);
    }

    const newUser = await this.usersQueryRepository.getUserById(
      userCreateResult.data.newUserId,
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
  @ApiBasicAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUserById(@Param('id', ParseIntPipe) id: number) {
    await this.commandBus.execute(new DeleteUserCommand(id));
  }
}
