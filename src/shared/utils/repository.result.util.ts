import { UserDocument } from '../../modules/users-account/users/domain/users.model';
import { RepositoryResultType } from '../types/repository.result.type';

type RepositoryResultUnionType = UserDocument | UserDocument[];

export class RepositoryResultObject {
  static successResult<T extends RepositoryResultUnionType>(
    data: T,
  ): RepositoryResultType<T | null> {
    return {
      success: true,
      data: data,
    };
  }
  static failureResult<T>(
    message: string,
    code?: string,
  ): RepositoryResultType<T | null> {
    return {
      success: false,
      data: null,
      error: {
        message,
        code,
      },
    };
  }
}
