import { JwtService } from '@nestjs/jwt';
import { jwtConfig } from '../../../../config/jwt.config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}
  generateTokens(userId: string) {
    const accessToken = this.jwtService.sign(
      { id: userId },
      {
        secret: jwtConfig.access.secret,
        expiresIn: jwtConfig.access.expiresIn,
      },
    );
    return { accessToken };
  }
}
