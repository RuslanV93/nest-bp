import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../domain/users.orm.domain';
import { ILike, Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { UserViewDto } from '../../interfaces/dto/userViewDto';
import {
  GetUsersQueryParams,
  UserSortBy,
} from '../../interfaces/dto/get-users.query-params.input.dto';
import { SortDirection } from '../../../../../core/dto/base.query-params.input-dto';
import { ResultWithTotalCountType } from '../../../../../shared/types/result.with.total-count.type';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';

@Injectable()
export class UsersOrmQueryRepository {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getUserById(id: ObjectId) {
    const stringId = id.toString();
    const user: User | null = await this.userRepository.findOne({
      where: { _id: stringId },
    });
    if (!user) {
      throw new NotFoundException('User not Found');
    }
    return UserViewDto.mapToView(user);
  }
  async getUsers(query: GetUsersQueryParams) {
    const validSortDirection =
      query.sortDirection === SortDirection.asc ||
      query.sortDirection === SortDirection.desc
        ? query.sortDirection
        : 'desc';
    const validSortField =
      query.sortBy === UserSortBy.login
        ? 'login'
        : query.sortBy === UserSortBy.email
          ? 'email'
          : 'createdAt';

    const [users, totalCount]: ResultWithTotalCountType<User> =
      await this.userRepository.findAndCount({
        where:
          query.searchLoginTerm || query.searchEmailTerm
            ? [
                { login: ILike(`%${query.searchLoginTerm}%`) },
                { email: ILike(`%${query.searchEmailTerm}%`) },
              ]
            : {},

        take: query.pageSize,
        skip: query.calculateSkipParam(),
        order: { [validSortField]: validSortDirection },
      });
    const items = users.map(UserViewDto.mapToView);
    return PaginatedViewDto.mapToView({
      items,
      page: query.pageNumber,
      size: query.pageSize,
      totalCount: totalCount,
    });
  }
}
