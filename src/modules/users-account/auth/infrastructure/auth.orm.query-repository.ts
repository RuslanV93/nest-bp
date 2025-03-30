import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/domain/users.orm.domain';
import { ObjectId } from 'mongodb';
import { MeType } from '../types/me.type';
import { MeViewDto } from '../../users/interfaces/dto/userViewDto';

@Injectable()
export class AuthOrmQueryRepository {
  constructor(
    @InjectRepository(User) private readonly authRepository: Repository<User>,
  ) {}
  async getMe(userId: ObjectId) {
    const me: MeType | null = await this.authRepository.findOne({
      where: {
        _id: userId.toString(),
      },
    });
    if (!me) {
      throw new NotFoundException('User does not exist');
    }
    return MeViewDto.mapToView(me);
  }
}
