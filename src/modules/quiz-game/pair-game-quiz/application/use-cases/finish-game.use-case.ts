import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { QuizGameRepository } from '../../infrastructure/repositories/quiz-game.repository';
import { GameService } from '../services/game.service';
import { Transactional } from 'typeorm-transactional';

export class FinishGameCommand {
  constructor(public gameId: number) {}
}

@CommandHandler(FinishGameCommand)
export class FinishGameUseCase implements ICommandHandler<FinishGameCommand> {
  constructor(
    private readonly quizGameRepository: QuizGameRepository,
    private eventBus: EventBus,
    private gameService: GameService,
  ) {}
  @Transactional()
  async execute(command: FinishGameCommand) {
    try {
      const currentGame = await this.quizGameRepository.findActiveGameByGameId(
        command.gameId,
      );
      if (currentGame.finishGameDate) {
        return;
      }

      const events = currentGame.getDomainEvents();
      for (const player of currentGame.players) {
        let answeredCount = player.answers.length;
        while (answeredCount < 5) {
          if (answeredCount === 5) continue;
          const nextQuestion = this.gameService.getNextQuestion(
            currentGame,
            answeredCount,
          );
          player.answerQuestion(currentGame, nextQuestion, 'not answered');
          answeredCount = player.answers.length;
        }
      }
      currentGame.finishGame();
      for (const event of events) {
        this.eventBus.publish(event);
      }
      currentGame.clearEvents();
      await this.quizGameRepository.save(currentGame);
      return currentGame;
    } catch (e) {
      console.log(e);
    }
  }
}
