import { Injectable } from '@nestjs/common';
import { LoginInputDto } from '../interfaces/dto/login.input-dto';
import { UsersRepository } from '../../users/infrastructure/repositories/users.repository';
import { CryptoService } from './crypto.service';
import { UnauthorizedDomainException } from '../../../../core/exceptions/domain-exception';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from './jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly cryptoService: CryptoService,
    private readonly tokenService: TokenService,
  ) {}
  async login(loginDto: LoginInputDto) {
    const user = await this.usersRepository.findByEmailAndLoginField(
      loginDto.loginOrEmail,
    );
    if (!user) {
      throw UnauthorizedDomainException.create(
        'Incorrect login',
        'loginOrEmail',
      );
    }
    const passwordIsMatch = await this.cryptoService.comparePassword(
      loginDto.password,
      user.passwordInfo.passwordHash,
    );
    if (!passwordIsMatch) {
      throw UnauthorizedDomainException.create(
        'Incorrect password',
        'password',
      );
    }
    const { accessToken } = this.tokenService.generateTokens(
      user._id.toString(),
    );
    return { accessToken };
  }
}
