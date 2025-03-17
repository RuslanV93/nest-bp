import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserContextDto } from '../dto/user-context.dto';
import { CoreConfig } from '../../../../../core/core-config/core.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly coreConfig: CoreConfig) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: coreConfig.jwtAccessSecret,
    });
  }

  validate(payload: UserContextDto) {
    if (!payload || !payload.id) {
      throw new UnauthorizedException('Invalid token payload');
    }
    return payload;
  }
}
