import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Job } from 'bullmq';
import { FinishGameCommand } from '../../application/use-cases/finish-game.use-case';

@Injectable()
@Processor('game-finish-queue')
export class GameFinishProcessor extends WorkerHost {
  constructor(private readonly commandBus: CommandBus) {
    super();
  }
  async process(job: Job<{ gameId: number }>) {
    const gameId = job.data.gameId;
    console.log('from queue');
    await this.commandBus.execute(new FinishGameCommand(gameId));

    return { success: true, message: 'Game finished successfully' };
  }
}
