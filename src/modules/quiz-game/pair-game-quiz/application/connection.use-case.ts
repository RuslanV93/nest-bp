import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersOrmRepository } from '../../../users-account/users/infrastructure/repositories/users.orm.repository';
import { QuizGameRepository } from '../infrastructure/repositories/quiz-game.repository';
import { Game } from '../domain/game.orm.domain';
import { User } from '../../../users-account/users/domain/users.orm.domain';
import { Question } from '../../question/domain/question.orm.domain';
import { UnitOfWork } from '../infrastructure/repositories/unit.of.work';
import { EntityManager } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';

export class ConnectionCommand {
  constructor(public userId: number) {}
}

@CommandHandler(ConnectionCommand)
export class ConnectionUseCase implements ICommandHandler<ConnectionCommand> {
  constructor(
    private readonly usersRepository: UsersOrmRepository,
    private readonly quizGameRepository: QuizGameRepository,
    private readonly unitOfWork: UnitOfWork,
  ) {}
  async execute(command: ConnectionCommand) {
    return this.unitOfWork.runTransaction(async (manager: EntityManager) => {
      try {
        const user: User = await this.usersRepository.findOrNotFoundException(
          command.userId,
        );
        const pendingGame =
          await this.quizGameRepository.findPendingGame(manager);

        if (pendingGame) {
          pendingGame.addSecondPlayer(user);
          return this.quizGameRepository.save(pendingGame, manager);
        } else if (!pendingGame) {
          const questions: Question[] =
            await this.quizGameRepository.findFiveRandomQuestions();
          const newGame = Game.createInstance(user, questions);
          return this.quizGameRepository.save(newGame, manager);
        }
      } catch (e) {
        if (e instanceof Error) {
          throw new InternalServerErrorException(e.message);
        }
        throw new InternalServerErrorException('Unexpected error');
      }
    });
  }
}
