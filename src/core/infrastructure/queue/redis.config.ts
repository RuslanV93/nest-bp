import {
  BullRootModuleOptions,
  SharedBullConfigurationFactory,
} from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CoreConfig } from '../../core-config/core.config';

@Injectable()
export class RedisConfig implements SharedBullConfigurationFactory {
  constructor(
    private readonly coreConfig: CoreConfig,
    private readonly configService: ConfigService,
  ) {}

  createSharedConfiguration():
    | BullRootModuleOptions
    | Promise<BullRootModuleOptions> {
    const isProd = this.coreConfig.env === 'production';

    const redisOptions = isProd
      ? {
          host: this.configService.get<string>('REDIS_HOST_PROD'),
          port: this.configService.get<number>('REDIS_PORT_PROD'),
          username: this.configService.get<string>('REDIS_USERNAME'),
          password: this.configService.get<string>('REDIS_PASSWORD'),
        }
      : {
          host: this.configService.get<string>('REDIS_HOST'),
          port: this.configService.get<number>('REDIS_PORT'),
        };

    return {
      connection: redisOptions,
    };
  }
}
