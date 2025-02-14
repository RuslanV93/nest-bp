import { Injectable } from '@nestjs/common';
import { LoginInputDto } from '../interfaces/dto/login.input-dto';
import { UsersRepository } from '../../users/infrastructure/repositories/users.repository';

@Injectable()
export class AuthService {
  constructor(private usersRepository: UsersRepository) {}
  async login(loginDto: LoginInputDto) {
    const user = await this.usersRepository.findByEmailAndLoginField(
      loginDto.loginOrEmail,
    );
  }
}
