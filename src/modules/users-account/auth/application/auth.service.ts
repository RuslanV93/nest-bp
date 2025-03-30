import { Injectable } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { UsersOrmRepository } from '../../users/infrastructure/repositories/users.orm.repository';
import { User } from '../../users/domain/users.orm.domain';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersOrmRepository,
    private readonly cryptoService: CryptoService,
  ) {}
  async validateUser(loginOrEmail: string, password: string) {
    const user: User | null =
      await this.usersRepository.findByEmailAndLoginField(loginOrEmail);
    if (!user) {
      return null;
    }
    const passwordIsMatch = await this.cryptoService.comparePassword(
      password,
      user.passwordInfo.passwordHash,
    );
    if (!passwordIsMatch) {
      return null;
    }
    return { id: user._id };
  }
}
