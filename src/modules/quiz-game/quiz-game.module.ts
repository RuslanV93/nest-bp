import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { QuestionController } from './question/interfaces/questions.controller';
import { CreateQuestionUseCase } from './question/application/use-cases/create-question.use-case';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './question/domain/question.orm.domain';
import { UsersAccountModule } from '../users-account/users-account.module';
import { DeleteQuestionUseCase } from './question/application/use-cases/delete-question.use-case';
import { UpdateQuestionUseCase } from './question/application/use-cases/update-question.use-case';
import { UpdateQuestionPublishUseCase } from './question/application/use-cases/update-question-publish.use-case';
import { QuestionsRepository } from './question/infrastructure/repositories/questions.repository';
import { QuestionsQueryRepository } from './question/infrastructure/repositories/questions.query-repository';
import { Player } from './pair-game-quiz/domain/player.orm.domain';
import { Game } from './pair-game-quiz/domain/game.orm.domain';
import { GameQuestion } from './pair-game-quiz/domain/game-question.orm.domain';
import { GameAnswer } from './pair-game-quiz/domain/answer.orm.domain';
import { ConnectionUseCase } from './pair-game-quiz/application/connection.use-case';
import { QuizGameRepository } from './pair-game-quiz/infrastructure/repositories/quiz-game.repository';
import { QuizGameQueryRepository } from './pair-game-quiz/infrastructure/repositories/quiz-game.query-repository';
import { UnitOfWork } from './pair-game-quiz/infrastructure/repositories/unit.of.work';
import { AnswerUseCase } from './pair-game-quiz/application/answer.use-case';
import { GetCurrentGameHandler } from './pair-game-quiz/application/current-game.query-handler';
import { GameAnswerHandler } from './pair-game-quiz/application/game-answer.query-handler';
import { GetGameByIdHandler } from './pair-game-quiz/application/game-by-id.query-handler';
import { PairGameQuizController } from './pair-game-quiz/interfaces/pair-game-quiz.controller';
import { GameEventHandler } from './pair-game-quiz/application/event-handlers/game.event.handler';
import { GetMyGamesHandler } from './pair-game-quiz/application/my-games.query-handler';
import { GetStatisticHandler } from './pair-game-quiz/application/statistic.query-handler';
import { Statistic } from './pair-game-quiz/domain/statistic.orm.domain';
import { GetPlayersTopHandler } from './pair-game-quiz/application/get-top.query-handler';
import { LoggingMiddleware } from '../../core/middleware/request.logger.middleware';

const QuestionUseCases = [
  CreateQuestionUseCase,
  DeleteQuestionUseCase,
  UpdateQuestionUseCase,
  UpdateQuestionPublishUseCase,
];
const GameUseCases = [
  ConnectionUseCase,
  AnswerUseCase,
  GetCurrentGameHandler,
  GameAnswerHandler,
  GetGameByIdHandler,
  GetMyGamesHandler,
  GetStatisticHandler,
  GetPlayersTopHandler,
];
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Question,
      Player,
      Game,
      GameQuestion,
      GameAnswer,
      Statistic,
    ]),
    UsersAccountModule,
  ],
  controllers: [QuestionController, PairGameQuizController],
  providers: [
    ...GameUseCases,
    ...QuestionUseCases,
    QuestionsRepository,
    QuestionsQueryRepository,
    QuizGameRepository,
    QuizGameQueryRepository,
    UnitOfWork,
    GameEventHandler,
  ],
})
export class QuizGameModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes(PairGameQuizController);
  }
}
