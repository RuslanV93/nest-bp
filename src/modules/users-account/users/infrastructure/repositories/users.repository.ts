import { Injectable, NotFoundException } from '@nestjs/common';
import { User, UserDocument, UserModelType } from '../../domain/users.model';
import { ObjectId } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';
import { BadRequestDomainException } from '../../../../../core/exceptions/domain-exception';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: UserModelType) {}
  async findById(id: ObjectId): Promise<UserDocument | null> {
    return this.userModel.findOne({
      _id: id,
      deletedAt: null,
    });
  }
  async findExistingUserByLoginOrEmail(login: string, email: string) {
    const user = await this.userModel.findOne({
      $or: [{ login }, { email }],
    });
    if (!user) {
      return null;
    }
    return user.login === login
      ? { user, field: 'login' }
      : { user, field: 'email' };
  }

  async findByEmailConfirmCode(confirmCode: string) {
    const user = await this.userModel.findOne({
      'emailConfirmationInfo.confirmCode': confirmCode,
    });

    if (!user) {
      throw BadRequestDomainException.create(
        'Confirm code is incorrect',
        'code',
      );
    }
    return user;
  }
  async findByPasswordConfirmCode(confirmCode: string) {
    const user = await this.userModel.findOne({
      'passwordInfo.passwordRecoveryCode': confirmCode,
    });
    if (!user) {
      throw BadRequestDomainException.create(
        'User does not exist',
        'recoveryCode',
      );
    }
    return user;
  }

  async save(user: UserDocument): Promise<ObjectId> {
    const newUser: UserDocument = await user.save();
    return newUser._id;
  }
  async findByEmailAndLoginField(
    loginOrEmail: string,
  ): Promise<UserDocument | null> {
    const filter: { email?: string; login?: string; deletedAt: null } = {
      deletedAt: null,
    };

    if (loginOrEmail.includes('@')) {
      filter.email = loginOrEmail.toLowerCase();
    } else {
      filter.login = loginOrEmail;
    }

    const user = await this.userModel.findOne(filter);
    if (!user) {
      return null;
    }
    return user;
  }
  async findOrNotFoundException(id: ObjectId): Promise<UserDocument> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('User not Found');
    }
    return user;
  }
}
