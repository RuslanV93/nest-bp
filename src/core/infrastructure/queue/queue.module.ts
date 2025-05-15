import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'game-finish-queue',
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
