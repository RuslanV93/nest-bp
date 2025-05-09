import { Player } from './player.orm.domain';

export interface DomainEvent {
  eventName: string;
  occurredAt: Date;
}

export interface GameResult {
  winnerId: number | null; // null если ничья
  isDraw: boolean;
  scores: { userId: number; score: number }[];
}

export class GameFinishedEvent implements DomainEvent {
  eventName: string = 'GameFinished';
  occurredAt: Date;

  constructor(
    public gameId: number,
    public players: Player[],
    public gameResult: GameResult,
  ) {
    this.occurredAt = new Date();
  }
}
