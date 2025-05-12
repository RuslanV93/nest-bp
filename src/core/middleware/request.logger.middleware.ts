import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`[LOGGING MIDDLEWARE] URL: ${req.originalUrl}`);
    console.log(`[LOGGING MIDDLEWARE] Query:`, req.query);
    next();
  }
}
