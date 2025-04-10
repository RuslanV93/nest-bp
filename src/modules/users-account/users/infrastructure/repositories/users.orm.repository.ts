import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/users.orm.domain';
import { IsNull } from 'typeorm';
import { ObjectId } from 'mongodb';
import { NotFoundException } from '@nestjs/common';
import { BadRequestDomainException } from '../../../../../core/exceptions/domain-exception';

export class UsersOrmRepository {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async findById(id: ObjectId) {
    return this.userRepository.findOne({
      where: { _id: id.toString(), deletedAt: IsNull() },
      relations: ['emailConfirmationInfo', 'passwordInfo'],
    });
  }

  async findOrNotFoundException(id: ObjectId) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  async findByEmailConfirmCode(confirmCode: string) {
    const user = await this.userRepository.findOne({
      where: {
        emailConfirmationInfo: {
          confirmCode: confirmCode,
        },
        deletedAt: IsNull(),
      },
      relations: ['emailConfirmationInfo', 'passwordInfo'],
    });

    if (!user) {
      throw BadRequestDomainException.create('User does not exist', 'code');
    }
    return user;
  }
  async findExistingUserByLoginOrEmail(login: string, email: string) {
    try {
      const user = await this.userRepository.findOne({
        where: [
          { login: login, deletedAt: IsNull() },
          { email: email, deletedAt: IsNull() },
        ],
        relations: ['emailConfirmationInfo', 'passwordInfo'],
      });
      if (!user) {
        return null;
      }
      return user.login === login
        ? { user, field: 'login' }
        : { user, field: 'email' };
    } catch (error) {
      console.log(error);
    }
  }
  async findByPasswordRecoveryCode(recoveryCode: string) {
    const user = await this.userRepository.findOne({
      where: {
        passwordInfo: {
          passwordRecoveryCode: recoveryCode,
        },
        deletedAt: IsNull(),
      },
      relations: ['emailConfirmationInfo', 'passwordInfo'],
    });
    if (!user) {
      throw BadRequestDomainException.create(
        'User does not exist',
        'recoveryCode',
      );
    }
    return user;
  }

  async findByEmailAndLoginField(loginOrEmail: string) {
    const user = await this.userRepository.findOne({
      where: [
        { login: loginOrEmail, deletedAt: IsNull() },
        { email: loginOrEmail, deletedAt: IsNull() },
      ],
      relations: ['emailConfirmationInfo', 'passwordInfo'],
    });
    if (!user) {
      return null;
    }
    return user;
  }

  async save(userToSave: User) {
    return this.userRepository.save(userToSave);
  }

  async createUser(newUser: User) {
    try {
      const user = this.userRepository.create(newUser);
      const savedUser = await this.userRepository.save(user);
      return new ObjectId(savedUser._id);
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async deleteUser(userToDelete: User) {
    await this.userRepository.softRemove(userToDelete);
  }
}
