import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class SoftJwtAuthGuard extends AuthGuard('soft-jwt') {
  handleRequest(err, user, info) {
    if (err || !user) {
      return null;
    }
    return user;
  }
}
