import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { appConfig } from '../../../../../app.config';
import { UserContextDto } from '../dto/user-context.dto';
import { Request } from 'express';
import { UnauthorizedDomainException } from '../../../../../core/exceptions/domain-exception';
import { TokenService } from '../../application/jwt.service';

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
