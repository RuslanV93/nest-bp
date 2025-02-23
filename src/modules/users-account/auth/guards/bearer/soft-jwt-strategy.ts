import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserContextDto } from '../dto/user-context.dto';
import { ObjectId } from 'mongodb';

@Injectable()
export class SoftJwtStrategy extends PassportStrategy(Strategy, 'soft-jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_ACCESS_SECRET || 'default',
    });
  }

  validate(payload: UserContextDto) {
    if (!payload || !payload.id) {
      return null;
    }

    return payload;
  }
}
