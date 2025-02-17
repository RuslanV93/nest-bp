import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UnauthorizedDomainException } from '../../../../../core/exceptions/domain-exception';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/is-public.decorator';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  private readonly login = 'admin';
  private readonly password = 'qwerty';
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      throw UnauthorizedDomainException.create('Incorrect credentials');
    }
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString(
      'utf-8',
    );
    const [username, password] = credentials.split(':');
    if (username === this.login && password === this.password) {
      return true;
    } else {
      throw UnauthorizedDomainException.create('Incorrect credentials');
    }
  }
}
