import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { IsBoolean, IsEnum, IsNotEmpty } from 'class-validator';
import { configValidationUtility } from './shared/utils/config-validation-utility';

enum EnvTypes {
  TESTING = 'testing',
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}
@Injectable()
export class AppConfig {
  @IsEnum(EnvTypes)
  env: string = this.configService.getOrThrow('NODE_ENV');
  port: number = Number(this.configService.getOrThrow('PORT'));
  mongoUri: string = this.configService.getOrThrow('MONGO_URL');
  localUrl: string = this.configService.getOrThrow('URL');
  jwtAccessSecret: string = this.configService.getOrThrow('JWT_ACCESS_SECRET');
  postgresLogin: string = this.configService.getOrThrow('POSTGRES_LOGIN');
  postgresPassword: string = this.configService.getOrThrow('POSTGRES_PASSWORD');
  postgresUrl: string = this.configService.getOrThrow('POSTGRES_LOCAL_URL');
  postgresPort: string = this.configService.getOrThrow('POSTGRES_PORT');
  postgresDbName: string = this.configService.getOrThrow(
    'POSTGRES_DATABASE_NAME',
  );
  jwtRefreshSecret: string =
    this.configService.getOrThrow('JWT_REFRESH_SECRET');
  @IsNotEmpty({
    message: 'refresh jwt token expiring time should not to be empty',
  })
  jwtAccessExpires: string = this.configService.getOrThrow(
    'JWT_ACCESS_TOKEN_EXPIRE',
  );
  @IsNotEmpty({
    message: 'access jwt token expiring time should not to be empty',
  })
  jwtRefreshExpires: string = this.configService.getOrThrow(
    'JWT_REFRESH_TOKEN_EXPIRE',
  );
  @IsBoolean({
    message: 'isSwaggerEnabled must be a boolean',
  })
  isSwaggerEnabled: boolean = configValidationUtility.convertToBoolean(
    this.configService.get('IS_SWAGGER_ENABLED'),
  );
  constructor(private readonly configService: ConfigService) {
    configValidationUtility.validateConfig(this);
  }
}

export class ConfigurationService {
  private static instance: ConfigurationService;
  private config: AppConfig;

  private constructor() {
    const configService = new ConfigService();
    this.config = new AppConfig(configService);
  }

  public static getInstance(): ConfigurationService {
    if (!ConfigurationService.instance) {
      ConfigurationService.instance = new ConfigurationService();
    }
    return ConfigurationService.instance;
  }

  getConfig(): AppConfig {
    return this.config;
  }
}

/**
 * Retrieves an instance of the application configuration
 * to access configuration values.
 */
export const appConfig = ConfigurationService.getInstance().getConfig();
