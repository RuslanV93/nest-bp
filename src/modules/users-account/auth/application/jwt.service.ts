import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { CoreConfig } from '../../../../core/core-config/core.config';

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
export interface RefreshTokenType {
  refreshToken: string;
}
export interface AccessTokenType {
  accessToken: string;
}
@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly coreConfig: CoreConfig,
  ) {}
  generateTokens(userId: string, deviceId: string): Tokens {
    const { accessToken } = this.generateAccessToken(userId);
    const { refreshToken } = this.generateRefreshToken(userId, deviceId);
    return { accessToken, refreshToken };
  }
  generateAccessToken(userId: string): AccessTokenType {
    const accessToken = this.jwtService.sign(
      { id: userId },
      {
        secret: this.coreConfig.jwtAccessSecret,
        expiresIn: this.coreConfig.jwtAccessExpires,
      },
    );
    return { accessToken };
  }
  generateRefreshToken(userId: string, deviceId: string): RefreshTokenType {
    const refreshToken = this.jwtService.sign(
      { id: userId, deviceId: deviceId },
      {
        secret: this.coreConfig.jwtRefreshSecret,
        expiresIn: this.coreConfig.jwtRefreshExpires,
      },
    );
    return { refreshToken };
  }
  getRefreshTokenPayload(token: string): {
    id: string;
    exp: string;
    deviceId: string;
  } {
    return this.jwtService.decode(token);
  }
}
