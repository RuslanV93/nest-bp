import { appConfig } from '../app.config';

export const jwtConfig = {
  access: {
    secret: appConfig.jwtAccessSecret,
    expiresIn: appConfig.jwtAccessExpires,
  },
  refresh: {
    secret: appConfig.jwtRefreshSecret,
    expiresIn: appConfig.jwtRefreshExpires,
  },
};
