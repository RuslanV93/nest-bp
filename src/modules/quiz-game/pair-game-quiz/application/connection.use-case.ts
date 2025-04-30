import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersOrmRepository } from '../../../users-account/users/infrastructure/repositories/users.orm.repository';
import { QuizGameRepository } from '../infrastructure/repositories/quiz-game.repository';
import { Game } from '../domain/game.orm.domain';
import { User } from '../../../users-account/users/domain/users.orm.domain';
import { Question } from '../../question/domain/question.orm.domain';

export class ConnectionCommandHandler {
  constructor(public userId: number) {}
}

@CommandHandler(ConnectionCommandHandler)
export class ConnectionUseCase
  implements ICommandHandler<ConnectionCommandHandler>
{
  constructor(
    private readonly usersRepository: UsersOrmRepository,
    private readonly quizGameRepository: QuizGameRepository,
  ) {}
  async execute(command: ConnectionCommandHandler) {
    const user: User = await this.usersRepository.findOrNotFoundException(
      command.userId,
    );
    const currentGame = await this.quizGameRepository.findOne();

    if (!currentGame) {
      const questions: Question[] =
        await this.quizGameRepository.findFiveRandomQuestions();
      const newGame = Game.createInstance(user, questions);
      await this.quizGameRepository.save(newGame);
    }
  }
}
