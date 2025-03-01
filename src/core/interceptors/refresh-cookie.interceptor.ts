import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Response } from 'express';

export class TokensResponseDto {
  constructor(
    public accessToken: string,
    public refreshToken: string,
    public isRefreshTokenCookie: boolean = true,
  ) {}
}
@Injectable()
export class CookieInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data instanceof TokensResponseDto && data.isRefreshTokenCookie) {
          const response: Response = context.switchToHttp().getResponse();
          response.cookie('refreshToken', data.refreshToken, {
            httpOnly: true,
            secure: true,
          });

          return { accessToken: data.accessToken };
        }
        return data;
      }),
    );
  }
}
