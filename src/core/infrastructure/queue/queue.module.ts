import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { RedisConfig } from './redis.config';
import { ConfigService } from '@nestjs/config';
import { CoreConfig } from '../../core-config/core.config';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'game-finish-queue',
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
