import { QueryHandler } from '@nestjs/cqrs';
import { QuizGameQueryRepository } from '../../infrastructure/repositories/quiz-game.query-repository';
import { UsersOrmRepository } from '../../../../users-account/users/infrastructure/repositories/users.orm.repository';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Game } from '../../domain/game.orm.domain';
import { GameViewDto } from '../../interfaces/dto/game.view-dto';

export class GetGameByIdQuery {
  constructor(
    public gameId: number,
    public userId: number,
  ) {}
}

@QueryHandler(GetGameByIdQuery)
export class GetGameByIdHandler {
  constructor(
    private readonly quizGameQueryRepository: QuizGameQueryRepository,
    private readonly usersOrmRepository: UsersOrmRepository,
  ) {}

  async execute(query: GetGameByIdQuery) {
    const existingUser = await this.usersOrmRepository.findById(query.userId);
    if (!existingUser) {
      throw new NotFoundException('User not found.');
    }

    const game: Game | null = await this.quizGameQueryRepository.getGame(
      undefined,
      query.gameId,
    );

    if (!game) {
      throw new NotFoundException('Game not found.');
    }

    const isUserPlayer = game.players.some(
      (player) => player.userId === query.userId,
    );
    if (!isUserPlayer) {
      throw new ForbiddenException('User is not a player in this game.');
    }
    return GameViewDto.mapToView(game);
  }
}
