import { Module } from '@nestjs/common';
import { QuestionController } from './question/interfaces/questions.controller';
import { CreateQuestionUseCase } from './question/application/use-cases/create-question.use-case';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './question/domain/question.orm.domain';
import { UsersAccountModule } from '../users-account/users-account.module';

@Module({
  imports: [TypeOrmModule.forFeature([Question]), UsersAccountModule],
  controllers: [QuestionController],
  providers: [CreateQuestionUseCase],
})
export class QuizGameModule {}
