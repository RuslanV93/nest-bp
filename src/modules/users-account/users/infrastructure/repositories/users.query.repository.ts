// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { User, UserDocument, UserModelType } from '../../domain/users.model';
// import { ObjectId } from 'mongodb';
// import { GetUsersQueryParams } from '../../interfaces/dto/get-users.query-params.input.dto';
// import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
// import { FilterQuery } from 'mongoose';
// import { UserViewDto } from '../../interfaces/dto/userViewDto';
//
// @Injectable()
// export class UsersQueryRepository {
//   constructor(
//     @InjectModel(User.name) private readonly userModel: UserModelType,
//   ) {}
//   async getUsers(
//     query: GetUsersQueryParams,
//   ): Promise<PaginatedViewDto<UserViewDto[]> | null> {
//     const filter: FilterQuery<User> = { deletedAt: null };
//     if (query.searchLoginTerm) {
//       filter.$or = filter.$or || [];
//       filter.$or.push({
//         login: { $regex: query.searchLoginTerm, $options: 'i' },
//       });
//     }
//     if (query.searchEmailTerm) {
//       filter.$or = filter.$or || [];
//       filter.$or.push({
//         email: { $regex: query.searchEmailTerm, $options: 'i' },
//       });
//     }
//     const users: UserDocument[] = await this.userModel
//       .find(filter)
//       .sort({
//         [query.sortBy]: query.sortDirection,
//       })
//       .skip(query.calculateSkipParam())
//       .limit(query.pageSize);
//     const totalCount: number = await this.userModel.countDocuments(filter);
//
//     const items = users.map(UserViewDto.mapToView);
//     return PaginatedViewDto.mapToView({
//       items,
//       page: query.pageNumber,
//       size: query.pageSize,
//       totalCount,
//     });
//   }
//   async getUserById(id: ObjectId) {
//     const newUser = await this.userModel.findOne({ _id: id });
//     if (!newUser) {
//       return null;
//     }
//     return UserViewDto.mapToView(newUser);
//   }
// }
