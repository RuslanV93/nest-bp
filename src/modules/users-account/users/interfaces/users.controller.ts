import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { UsersQueryRepository } from '../infrastructure/repositories/users.query.repository';
import { RepositoryResultType } from '../../../../shared/types/repository.result.type';

export function isFailure<T>(
  result: RepositoryResultType<T>,
): result is RepositoryResultType<T> & {
  error: { message: string; code?: string };
} {
  return !result.success && result.error !== undefined;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersQueryRepository: UsersQueryRepository) {}
  @Get()
  async getUsers() {
    const usersResult = await this.usersQueryRepository.getUsers();
    if (isFailure(usersResult)) {
      throw new HttpException(
        {
          error: usersResult.error.message,
          code: usersResult.error.code,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return usersResult.data;
  }

  @Post()
  addNewUser() {}
}
