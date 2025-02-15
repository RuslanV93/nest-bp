import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../users/infrastructure/repositories/users.repository';
import { CryptoService } from './crypto.service';
import { TokenService } from './jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly cryptoService: CryptoService,
    private readonly tokenService: TokenService,
  ) {}
  async validateUser(loginOrEmail: string, password: string) {
    const user =
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
    return { id: user._id.toString() };
  }
  login(userId: string) {
    const { accessToken } = this.tokenService.generateTokens(userId);
    return { accessToken };
  }
}
