import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import useragent from 'useragent';

@Injectable()
export class UserAgentInterceptor implements NestInterceptor {
  private getIp(request: Request) {
    return Array.isArray(request.headers['x-forwarded-for'])
      ? request.headers['x-forwarded-for'][0]
      : request.headers['x-forwarded-for'] || request.socket.remoteAddress;
  }
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request: Request = context.switchToHttp().getRequest();

    const ip = this.getIp(request);

    const userAgentString = request.headers['user-agent'] || '';
    const userAgentInfo = useragent.parse(userAgentString);
    request.clientInfo = {
      ip,
      browser: userAgentInfo.family,
      os: userAgentInfo.os.family,
      device: userAgentInfo.device.family,
      userAgentString,
    };

    return next.handle();
  }
}
