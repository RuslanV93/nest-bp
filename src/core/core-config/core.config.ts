import { Injectable } from '@nestjs/common';
import { IsBoolean, IsEnum, IsNotEmpty } from 'class-validator';
import { configValidationUtility } from '../../shared/utils/config-validation-utility';
import { ConfigService } from '@nestjs/config';

enum EnvTypes {
  TESTING = 'testing',
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}
@Injectable()
export class CoreConfig {
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
  emailSenderAddress: string = this.configService.getOrThrow(
    'EMAIL_SENDER_ADDRESS',
  );
  emailPassCode: string = this.configService.getOrThrow('EMAIL_PASS_CODE');
  productionUrl: string = this.configService.getOrThrow('WEBSITE_URL');
  constructor(private readonly configService: ConfigService) {
    configValidationUtility.validateConfig(this);
  }
}
