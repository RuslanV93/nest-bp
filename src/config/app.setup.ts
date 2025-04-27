import { SwaggerConfigService } from './swagger.setup';
import { INestApplication } from '@nestjs/common';
import { setGlobalPrefixAndRedirectSetup } from './global-prefix.setup';
import { pipeSetup } from './pipe.setup';
import { exceptionFilterSetup } from './exception.setup';
import { SoftJwtAuthGuard } from '../modules/users-account/auth/guards/bearer/soft-jwt-auth-guard';
import cookieParser from 'cookie-parser';
import { UserAgentInterceptor } from '../core/interceptors/user-agent.interceptor';
import { CoreConfig } from '../core/core-config/core.config';

export const appSetup = (app: INestApplication) => {
  const coreConfig = app.get(CoreConfig);
  if (coreConfig.isSwaggerEnabled) {
    const swaggerConfigService = app.get(SwaggerConfigService);
    swaggerConfigService.setupSwagger(app);
  }
  app.useGlobalGuards(new SoftJwtAuthGuard());
  app.useGlobalInterceptors(
    new UserAgentInterceptor(),
    /** turn of ObjectId validator cuz app don't use object ids while using sql*/
    // new ObjectIdValidationInterceptor(),
  );
  app.use(cookieParser());
  pipeSetup(app);
  setGlobalPrefixAndRedirectSetup(app);
  exceptionFilterSetup(app);
};
