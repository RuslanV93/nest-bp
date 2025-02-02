import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModelType } from '../../domain/users.model';
import { RepositoryResultObject } from '../../../../../shared/utils/repository.result.util';
import { RepositoryResultType } from '../../../../../shared/types/repository.result.type';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectModel(User.name) private readonly UserModel: UserModelType,
  ) {}
  async getUsers(): Promise<RepositoryResultType<UserDocument[] | null>> {
    try {
      const users: UserDocument[] = await this.UserModel.find({}).exec();
      return RepositoryResultObject.successResult(users);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error(errorMessage);
      return RepositoryResultObject.failureResult(
        errorMessage,
        'DATABASE_ERROR',
      );
    }
  }
}
