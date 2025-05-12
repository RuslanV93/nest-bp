import { Injectable } from '@nestjs/common';
import { QuizGameRepository } from '../../infrastructure/repositories/quiz-game.repository';
import { EventsHandler } from '@nestjs/cqrs';
import { GameFinishedEvent, GameResult } from '../../domain/game-event.domain';
import { Statistic } from '../../domain/statistic.orm.domain';

@EventsHandler(GameFinishedEvent)
@Injectable()
export class GameEventHandler {
  constructor(private readonly quizGameRepository: QuizGameRepository) {}

  async handle(event: GameFinishedEvent) {
    for (const player of event.players) {
      await this.updateStatistics(player.userId, event.gameResult);
    }
  }
  async updateStatistics(userId: number, gameResult: GameResult) {
    let userStats =
      await this.quizGameRepository.findStatisticsByUserId(userId);
    if (!userStats) {
      userStats = new Statistic();
      userStats.userId = userId;
      userStats.gamesCount = 0;
      userStats.sumScore = 0;
      userStats.avgScores = 0;
      userStats.drawsCount = 0;
      userStats.winsCount = 0;
      userStats.lossesCount = 0;
    }
    userStats.gamesCount++;
    const playerScore = gameResult.scores.find((s) => s.userId === userId);
    if (playerScore) {
      userStats.sumScore += playerScore.score;
      userStats.avgScores = parseFloat(
        (userStats.sumScore / userStats.gamesCount).toFixed(2),
      );
    }
    if (gameResult.isDraw) {
      userStats.drawsCount++;
    } else if (gameResult.winnerId === userId) {
      userStats.winsCount++;
    } else if (gameResult.winnerId !== userId) {
      userStats.lossesCount++;
    }

    await this.quizGameRepository.saveStatistic(userStats);
  }
}
