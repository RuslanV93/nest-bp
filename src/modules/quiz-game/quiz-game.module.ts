import { Module } from '@nestjs/common';
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

const QuestionUseCases = [
  CreateQuestionUseCase,
  DeleteQuestionUseCase,
  UpdateQuestionUseCase,
  UpdateQuestionPublishUseCase,
];
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Question,
      Player,
      Game,
      GameQuestion,
      GameAnswer,
    ]),
    UsersAccountModule,
  ],
  controllers: [QuestionController],
  providers: [
    ...QuestionUseCases,
    QuestionsRepository,
    QuestionsQueryRepository,
  ],
})
export class QuizGameModule {}
