import { INestApplication } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export const setGlobalPrefixAndRedirectSetup = (app: INestApplication) => {
  app.setGlobalPrefix('api');
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.path === '/') {
      return res.redirect('/api');
    }
    next();
  });
};
