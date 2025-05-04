import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game, GameStatusType } from '../../domain/game.orm.domain';
import { Repository } from 'typeorm';

@Injectable()
export class QuizGameQueryRepository {
  constructor(
    @InjectRepository(Game) private readonly gameRepository: Repository<Game>,
  ) {}

  async getMyCurrentGame(userId: number): Promise<Game | null> {
    const queryBuilder = this.gameRepository.createQueryBuilder('game');

    queryBuilder
      .leftJoinAndSelect('game.players', 'player')
      .leftJoin('player.user', 'user')
      .addSelect('user.login', 'login')
      .leftJoinAndSelect('game.questions', 'gameQuestion')
      .leftJoinAndSelect('gameQuestion.question', 'question')
      .leftJoinAndSelect('player.answers', 'answer')
      .leftJoinAndSelect('answer.gameQuestion', 'gameQuestion')
      .where('player.userId = :userId', { userId })
      .andWhere('game.status IN (:...statuses)', {
        statuses: [GameStatusType.Active, GameStatusType.PendingSecondPlayer],
      })
      .orderBy('gameQuestion.order', 'ASC')
      .orderBy('answer', 'ASC');

    const game: Game | null = await queryBuilder.getOne();
    // const gameRawData = await queryBuilder.getRawOne
    if (!game) {
      return null;
    }
    return game;
  }
  async getPairById() {}
}
