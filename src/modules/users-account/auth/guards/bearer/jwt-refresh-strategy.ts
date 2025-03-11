import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { appConfig } from '../../../../../app.config';
import { UserContextDto } from '../dto/user-context.dto';
import { Request } from 'express';
import { UnauthorizedDomainException } from '../../../../../core/exceptions/domain-exception';
import { TokenService } from '../../application/jwt.service';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { Reflector } from '@nestjs/core';
import { DevicesSqlRepository } from '../../../devices/infrastructure/repositories/devices.sql.repository';

export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly tokenService: TokenService) {
    super({
      jwtFromRequest: (req: Request) => req?.cookies?.refreshToken,
      ignoreExpiration: false,
      secretOrKey: appConfig.jwtRefreshSecret,
      passReqToCallback: true,
    });
  }
  validate(req: Request, payload: UserContextDto) {
    const refreshToken = req.cookies.refreshToken;
    if (!payload || !payload.id || !refreshToken) {
      throw UnauthorizedDomainException.create('Invalid refresh token');
    }
    return payload;
  }
}

export class SoftRefreshStrategy implements CanActivate {
  constructor(
    @Inject(forwardRef(() => TokenService))
    private readonly tokenService: TokenService,
    @Inject(forwardRef(() => DevicesSqlRepository))
    private readonly devicesRepository: DevicesSqlRepository,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest<Request>();
    const response: Response = context.switchToHttp().getResponse<Response>();
    const refreshToken: string = request.cookies.refreshToken;

    if (!refreshToken) {
      return true;
    }

    try {
      const tokenPayload =
        this.tokenService.getRefreshTokenPayload(refreshToken);

      if (!tokenPayload?.id || !tokenPayload?.exp) {
        return true;
      }

      const now = Math.floor(Date.now() / 1000);
      if (Number(tokenPayload.exp) < now) {
        return true;
      }

      const session = await this.devicesRepository.findSessionByDeviceId(
        tokenPayload.deviceId,
        new ObjectId(tokenPayload.id),
      );

      if (session) {
        throw new HttpException(
          'User already has active session',
          HttpStatus.BAD_REQUEST,
        );
      }

      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw new BadRequestException('User already has active session');
      }
      return true;
    }
  }
}
