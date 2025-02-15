import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../users/infrastructure/repositories/users.repository';
import { ObjectId } from 'mongodb';
import { MeViewDto } from '../../users/interfaces/dto/userViewDto';

@Injectable()
export class AuthQueryRepository {
  constructor(private readonly usersRepository: UsersRepository) {}
  async getMe(userId: string) {
    const user = await this.usersRepository.findOrNotFoundException(
      new ObjectId(userId),
    );
    return MeViewDto.mapToView(user);
  }
}
