import { CommandBus, CommandHandler } from '@nestjs/cqrs';
import { QuizGameRepository } from '../../infrastructure/repositories/quiz-game.repository';
import { logErrorToFile } from '../../../../../../common/error-logger';
import { HttpException, InternalServerErrorException } from '@nestjs/common';
import { Game } from '../../domain/game.orm.domain';
import { DomainException } from '../../../../../core/exceptions/domain-exception';
import { Transactional } from 'typeorm-transactional';
import { GameService } from '../services/game.service';
import { FinishGameCommand } from './finish-game.use-case';

export class AnswerCommand {
  constructor(
    public answer: string,
    public userId: number,
  ) {}
}

@CommandHandler(AnswerCommand)
export class AnswerUseCase {
  constructor(
    private readonly quizGameRepository: QuizGameRepository,
    private readonly commandBus: CommandBus,
    private readonly gameFinishService: GameService,
  ) {}
  @Transactional()
  async execute(command: AnswerCommand) {
    try {
      const currentGame: Game = await this.quizGameRepository.findActiveGame(
        command.userId,
      );
      const player = this.gameFinishService.getPlayer(
        currentGame,
        command.userId,
      );
      const answers = this.gameFinishService.getAnswers(player);
      const playerAnswersCount = answers.length;
      this.gameFinishService.checkIsAllQuestionsAnswered(answers, currentGame);

      const nextQuestion = this.gameFinishService.getNextQuestion(
        currentGame,
        playerAnswersCount,
      );
      const gameAnswer = player.answerQuestion(
        currentGame,
        nextQuestion,
        command.answer,
      );
      const playerAnsweredAll =
        player.answers.length === currentGame.gameQuestions.length;
      const otherPlayer = currentGame.players.find(
        (p) => p.userId !== command.userId,
      );
      const otherPlayerAnsweredAll =
        otherPlayer &&
        otherPlayer.answers.length === currentGame.gameQuestions.length;
      await this.quizGameRepository.save(currentGame);

      // If one of the players doesn't answer the questions in time,
      // the game will be finished by the scheduler.
      // Unanswered questions will automatically be marked as incorrect.
      if (playerAnsweredAll && otherPlayer && !otherPlayerAnsweredAll) {
        await this.gameFinishService.scheduleGameFinish(currentGame.id);
      }

      // If all questions answered default finishing game
      if (currentGame.checkIsAllQuestionsAnswered()) {
        await this.commandBus.execute(new FinishGameCommand(currentGame.id));
      }
      return gameAnswer;
    } catch (e) {
      logErrorToFile(e);

      if (e instanceof DomainException || e instanceof HttpException) {
        throw e;
      }

      if (e instanceof Error) {
        console.log(e);
        throw new InternalServerErrorException(e.message);
      }
      throw new InternalServerErrorException('Something went wrong!');
    }
  }
}
