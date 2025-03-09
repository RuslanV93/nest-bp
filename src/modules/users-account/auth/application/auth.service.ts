import { Injectable } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { UsersSqlRepository } from '../../users/infrastructure/repositories/users.sql.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersSqlRepository,
    private readonly cryptoService: CryptoService,
  ) {}
  async validateUser(loginOrEmail: string, password: string) {
    const user: any =
      await this.usersRepository.findByEmailAndLoginField(loginOrEmail);

    if (!user) {
      return null;
    }
    const passwordIsMatch = await this.cryptoService.comparePassword(
      password,
      user.passwordHash,
    );
    if (!passwordIsMatch) {
      return null;
    }
    return { id: user._id.toString() };
  }
}
