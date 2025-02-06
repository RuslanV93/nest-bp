import { Injectable } from '@nestjs/common';
import { UserInputDto } from '../interfaces/dto/userInputDto';
import { DomainUser } from '../domain/users.domain';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModelType } from '../domain/users.model';
import { UsersRepository } from '../infrastructure/repositories/users.repository';
import { ObjectId } from 'mongodb';
import { ServiceResultObjectFactory } from '../../../../shared/utils/serviceResultObject';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private UserModel: UserModelType,
    private readonly usersRepository: UsersRepository,
  ) {}
  /** Creates new user entity and return */
  async createUser(userDto: UserInputDto) {
    const userEntity = DomainUser.create(
      userDto.login,
      userDto.email,
      userDto.password,
    );
    const user: UserDocument = this.UserModel.createInstance(
      userEntity.toSchema(),
    );
    const newUserId: ObjectId = await this.usersRepository.save(user);
    if (!newUserId) {
      return ServiceResultObjectFactory.internalErrorResultObject();
    }
    return ServiceResultObjectFactory.successResultObject(newUserId);
  }
  /** Delete existing user. Using soft deletion */
  async deleteUser(id: string) {
    const user = await this.usersRepository.findOrNotFoundException(id);
    try {
      const deleteDate = user.deleteUser();
      await this.usersRepository.save(user);
      return ServiceResultObjectFactory.successResultObject(deleteDate);
    } catch (error) {
      return ServiceResultObjectFactory.notFoundResultObject({
        message: error instanceof Error ? error.message : 'User not found',
      });
    }
  }
}
