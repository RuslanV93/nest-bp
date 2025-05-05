import { QueryHandler } from '@nestjs/cqrs';
import { QuizGameQueryRepository } from '../infrastructure/repositories/quiz-game.query-repository';
import { UsersOrmRepository } from '../../../users-account/users/infrastructure/repositories/users.orm.repository';
import { NotFoundException } from '@nestjs/common';
import { Game } from '../domain/game.orm.domain';
import { GameViewDto } from '../interfaces/dto/game.view-dto';

export class GetCurrentGameQuery {
  constructor(public readonly userId: number) {}
}

@QueryHandler(GetCurrentGameQuery)
export class GetCurrentGameHandler {
  constructor(
    private readonly quizGameQueryRepository: QuizGameQueryRepository,
    private readonly usersRepository: UsersOrmRepository,
  ) {}
  async execute(query: GetCurrentGameQuery) {
    // Finding user. Not found or unauthorized?
    const existingUser = await this.usersRepository.findById(query.userId);

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const currentGame: Game | null = await this.quizGameQueryRepository.getGame(
      query.userId,
    );
    if (!currentGame) {
      throw new NotFoundException('Game not found');
    }
    return GameViewDto.mapToView(currentGame);
  }
}
