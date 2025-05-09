import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { QuizGameRepository } from '../infrastructure/repositories/quiz-game.repository';
import { logErrorToFile } from '../../../../../common/error-logger';
import {
  ForbiddenException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Game } from '../domain/game.orm.domain';
import { DomainException } from '../../../../core/exceptions/domain-exception';
import { Player } from '../domain/player.orm.domain';
import { GameAnswer } from '../domain/answer.orm.domain';
import { Transactional } from 'typeorm-transactional';

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
    private readonly eventBus: EventBus,
  ) {}
  @Transactional()
  async execute(command: AnswerCommand) {
    try {
      const currentGame: Game = await this.quizGameRepository.findActiveGame(
        command.userId,
      );
      const player = this.getPlayer(currentGame, command.userId);
      const answers = this.getAnswers(player);
      const playerAnswersCount = answers.length;
      this.checkIsAllQuestionsAnswered(answers, currentGame);

      const nextQuestion = this.getNextQuestion(
        currentGame,
        playerAnswersCount,
      );
      const gameAnswer = player.answerQuestion(
        currentGame,
        nextQuestion,
        command.answer,
      );

      currentGame.finishGame();
      const events = currentGame.getDomainEvents();
      for (const event of events) {
        this.eventBus.publish(event);
      }
      currentGame.clearEvents();

      await this.quizGameRepository.save(currentGame);
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
  getPlayer(game: Game, userId: number) {
    const player = game.players.find((p) => p.userId === userId);
    if (!player) {
      throw new NotFoundException('');
    }
    return player;
  }

  getAnswers(player: Player) {
    const answers = player.answers;
    if (!answers) {
      return [];
    }
    return answers;
  }

  checkIsAllQuestionsAnswered(answers: GameAnswer[], currentGame: Game) {
    if (answers.length >= currentGame.gameQuestions.length) {
      throw new ForbiddenException('You have already answered all questions');
    }
  }
  getNextQuestion(currentGame: Game, playerAnswersCount: number) {
    const sortedQuestions = currentGame.gameQuestions.sort(
      (a, b) => a.order - b.order,
    );

    const nextQuestion = sortedQuestions[playerAnswersCount];

    if (!nextQuestion) {
      throw new NotFoundException('Next question was not found!');
    }
    return nextQuestion;
  }
}
