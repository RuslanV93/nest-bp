import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/users.orm.domain';
import { IsNull } from 'typeorm';
import { ObjectId } from 'mongodb';
import { NotFoundException } from '@nestjs/common';
import { BadRequestDomainException } from '../../../../../core/exceptions/domain-exception';

export class UsersOrmRepository {
  constructor(
    @InjectRepository(User) private readonly user: Repository<User>,
  ) {}
  async findById(id: ObjectId) {
    return this.user.findOne({
      where: { _id: id.toString(), deletedAt: IsNull() },
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
    const user = await this.user.findOne({
      where: {
        emailConfirmationInfo: {
          confirmCode: confirmCode,
        },
      },
      relations: ['emailConfirmationInfo'],
    });

    if (!user) {
      throw BadRequestDomainException.create(
        'User does not exist',
        'recoveryCode',
      );
    }
    return user;
  }
}
