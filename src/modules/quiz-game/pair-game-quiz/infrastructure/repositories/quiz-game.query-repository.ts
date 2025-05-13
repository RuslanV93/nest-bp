import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game, GameStatusType } from '../../domain/game.orm.domain';
import { Repository } from 'typeorm';
import { GameAnswer } from '../../domain/answer.orm.domain';
import { Statistic } from '../../domain/statistic.orm.domain';
import {
  GameSortBy,
  GetGamesQueryParams,
} from '../../interfaces/dto/get-games.query-params';
import { GameViewDto } from '../../interfaces/dto/game.view-dto';
import { GetStatisticsQueryParams } from '../../interfaces/dto/get-statistic.query-params';
import { StatisticsViewDto } from '../../interfaces/dto/statistics.view-dto';
import { PlayerTopViewDto } from '../../interfaces/dto/player-top.view-dto';

@Injectable()
export class QuizGameQueryRepository {
  constructor(
    @InjectRepository(Game) private readonly gameRepository: Repository<Game>,
    @InjectRepository(GameAnswer)
    private readonly gameAnswerRepository: Repository<GameAnswer>,
    @InjectRepository(Statistic)
    private readonly statisticRepository: Repository<Statistic>,
  ) {}

  async getStatisticByUserId(userId: number) {
    return this.statisticRepository.findOne({ where: { userId: userId } });
  }
  async getGamesByUserId(userId: number, query: GetGamesQueryParams) {
    try {
      const direction =
        query.sortDirection?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
      const answersQuery = this.gameAnswerRepository
        .createQueryBuilder('ga')
        .leftJoin('ga.player', 'player')
        .orderBy('ga.date', 'ASC');

      const gameQuery = this.gameRepository
        .createQueryBuilder('game')
        .innerJoin('game.players', 'p', 'p.userId = :userId', {
          userId,
        })
        .leftJoinAndSelect('game.players', 'player')
        .leftJoinAndSelect('player.user', 'user')
        .leftJoinAndSelect('game.gameQuestions', 'gq')
        .leftJoinAndSelect('gq.question', 'question')
        .leftJoinAndSelect('player.answers', 'pa');

      const totalCount = await gameQuery.clone().getCount();

      if (query.sortBy === GameSortBy.status) {
        gameQuery.addOrderBy('game.status', direction);
      }
      if (query.sortBy === GameSortBy.pairCreatedDate) {
        gameQuery.addOrderBy('game.pairCreatedDate', direction);
      } else {
        gameQuery.addOrderBy('game.pairCreatedDate', 'DESC');
      }
      gameQuery.take(query.pageSize).skip(query.calculateSkipParam());

      const games: Game[] = await gameQuery.getMany();
      const items = games.map((game) => GameViewDto.mapToView(game));
      return { items, totalCount };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async getGame(userId?: number, gameId?: number) {
    try {
      const queryBuilder = this.gameRepository.createQueryBuilder('game');

      queryBuilder
        .leftJoinAndSelect('game.players', 'player')
        .leftJoinAndSelect('game.gameQuestions', 'gameQuestions')
        .leftJoinAndSelect('player.user', 'user')
        .leftJoinAndSelect(
          'player.answers',
          'answer',
          'answer.gameId = player.gameId',
        )
        .leftJoinAndSelect('gameQuestions.question', 'questions')
        .leftJoinAndSelect('answer.gameQuestion', 'answerGameQuestion');

      if (userId) {
        queryBuilder.innerJoin(
          'game.players',
          'playerFilter',
          'playerFilter.userId = :userId',
          { userId },
        );
      } else if (gameId) {
        queryBuilder.where('game.id = :gameId', { gameId });
      }
      const statuses = gameId
        ? [
            GameStatusType.Active,
            GameStatusType.PendingSecondPlayer,
            GameStatusType.Finished,
          ]
        : [GameStatusType.Active, GameStatusType.PendingSecondPlayer];

      queryBuilder
        .andWhere('game.status IN (:...statuses)', { statuses })
        .orderBy('gameQuestion.order', 'ASC')
        .orderBy('answer', 'ASC');
      const game: Game | null = await queryBuilder.getOne();
      // const gameRawData = await queryBuilder.getRawOne
      if (!game) {
        return null;
      }

      return game;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async getAnswer(answerId: number) {
    return this.gameAnswerRepository
      .createQueryBuilder('answer')
      .leftJoinAndSelect('answer.gameQuestion', 'gameQuestion')
      .where('answer.id = :answerId', { answerId })
      .getOne();
  }
  async getPlayersTop(query: GetStatisticsQueryParams) {
    try {
      const sorts = query.parsedSort;
      const playersTopQuery = this.statisticRepository
        .createQueryBuilder('stats')
        .leftJoinAndSelect('stats.user', 'user')
        .take(query.pageSize)
        .skip(query.calculateSkipParam());
      const totalCount = await playersTopQuery.clone().getCount();
      for (const sortParams of sorts) {
        playersTopQuery.addOrderBy(
          `stats.${sortParams.field}`,
          sortParams.direction,
        );
      }
      playersTopQuery.take(query.pageSize).skip(query.calculateSkipParam());
      const topPlayers = await playersTopQuery.getMany();
      const items = topPlayers.map((player) =>
        PlayerTopViewDto.mapToView(player),
      );
      return { items, totalCount };
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e);
    }
  }
}
