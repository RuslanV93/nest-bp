import { appConfig } from '../app.config';

export const mongoUrl: string = appConfig.mongoUri;
export const postgresUrl: string = appConfig.postgresUrl;
export const postgresLogin: string = appConfig.postgresLogin;
export const postgresPassword: string = appConfig.postgresPassword;
export const postgresPort: number = +appConfig.postgresPort;
export const postgresDbName: string = appConfig.postgresDbName;
