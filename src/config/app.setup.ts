import { swaggerSetup } from './swagger.setup';
import { INestApplication } from '@nestjs/common';
import { setGlobalPrefixAndRedirectSetup } from './global-prefix.setup';
import { pipeSetup } from './pipe.setup';
import { exceptionFilterSetup } from './exception.setup';
import { appConfig } from '../app.config';
import { SoftJwtAuthGuard } from '../modules/users-account/auth/guards/bearer/soft-jwt-auth-guard';

export const appSetup = (app: INestApplication) => {
  if (appConfig.isSwaggerEnabled) {
    swaggerSetup(app);
  }
  app.useGlobalGuards(new SoftJwtAuthGuard());

  pipeSetup(app);
  setGlobalPrefixAndRedirectSetup(app);
  exceptionFilterSetup(app);
};
