import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

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
  Inject,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { Reflector } from '@nestjs/core';
import { DevicesSqlRepository } from '../../../devices/infrastructure/repositories/devices.sql.repository';
import { SqlDomainDevice } from '../../../devices/domain/devices.domain';
import { CoreConfig } from '../../../../../core/core-config/core.config';

export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly tokenService: TokenService,
    private readonly coreConfig: CoreConfig,
  ) {
    super({
      jwtFromRequest: (req: Request) => req?.cookies?.refreshToken,
      ignoreExpiration: false,
      secretOrKey: coreConfig.jwtRefreshSecret,
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

      const session: SqlDomainDevice | null =
        await this.devicesRepository.findSessionByDeviceId(
          tokenPayload.deviceId,
          new ObjectId(tokenPayload.id),
        );

      if (session) {
        // Правильно получаем время истечения из сессии
        const sessionExpTimeUnix = Number(session.tokenVersion);
        const sessionExpDate = new Date(sessionExpTimeUnix * 1000);
        const now = new Date();

        if (sessionExpDate > now) {
          throw new BadRequestException('User already has active session');
        } else {
          await this.devicesRepository.deleteDevice(session);
        }
      }

      return true;
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw new BadRequestException('User already has active session');
      }
      return true;
    }
  }
}
