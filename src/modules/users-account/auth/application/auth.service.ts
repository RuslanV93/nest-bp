import { Injectable } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { UsersSqlRepository } from '../../users/infrastructure/repositories/users.sql.repository';
import { SqlDomainUser } from '../../users/domain/users.sql.domain';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersSqlRepository,
    private readonly cryptoService: CryptoService,
  ) {}
  async validateUser(loginOrEmail: string, password: string) {
    const user: SqlDomainUser | null =
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
}
