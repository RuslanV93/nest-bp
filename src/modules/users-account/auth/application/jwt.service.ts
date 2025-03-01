import { JwtService } from '@nestjs/jwt';
import { jwtConfig } from '../../../../config/jwt.config';
import { Injectable } from '@nestjs/common';
import { JwtPayloadType } from '../types/jwt.type';
import { UnauthorizedDomainException } from '../../../../core/exceptions/domain-exception';
import { ObjectId } from 'mongodb';

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
  constructor(private readonly jwtService: JwtService) {}
  generateTokens(userId: string, deviceId: string): Tokens {
    const { accessToken } = this.generateAccessToken(userId);
    const { refreshToken } = this.generateRefreshToken(userId, deviceId);
    return { accessToken, refreshToken };
  }
  generateAccessToken(userId: string): AccessTokenType {
    const accessToken = this.jwtService.sign(
      { id: userId },
      {
        secret: jwtConfig.access.secret,
        expiresIn: jwtConfig.access.expiresIn,
      },
    );
    return { accessToken };
  }
  generateRefreshToken(userId: string, deviceId: string): RefreshTokenType {
    const refreshToken = this.jwtService.sign(
      { id: userId, deviceId: deviceId },
      {
        secret: jwtConfig.refresh.secret,
        expiresIn: jwtConfig.refresh.expiresIn,
      },
    );
    return { refreshToken };
  }
  getRefreshTokenPayload(token: string): { exp: string; deviceId: string } {
    return this.jwtService.decode(token);
  }
}
