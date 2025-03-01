import { swaggerSetup } from './swagger.setup';
import { INestApplication } from '@nestjs/common';
import { setGlobalPrefixAndRedirectSetup } from './global-prefix.setup';
import { pipeSetup } from './pipe.setup';
import { exceptionFilterSetup } from './exception.setup';
import { appConfig } from '../app.config';
import { SoftJwtAuthGuard } from '../modules/users-account/auth/guards/bearer/soft-jwt-auth-guard';
import cookieParser from 'cookie-parser';
import { UserAgentInterceptor } from '../core/interceptors/user-agent.interceptor';
import { ObjectIdValidationInterceptor } from '../core/interceptors/object-id.validation-transformation-interceptor';

export const appSetup = (app: INestApplication) => {
  if (appConfig.isSwaggerEnabled) {
    swaggerSetup(app);
  }
  app.useGlobalGuards(new SoftJwtAuthGuard());
  app.useGlobalInterceptors(
    new UserAgentInterceptor(),
    new ObjectIdValidationInterceptor(),
  );
  app.use(cookieParser());
  pipeSetup(app);
  setGlobalPrefixAndRedirectSetup(app);
  exceptionFilterSetup(app);
};
