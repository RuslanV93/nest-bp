import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game, GameStatusType } from '../../domain/game.orm.domain';
import { Repository } from 'typeorm';
import { Question } from '../../../question/domain/question.orm.domain';
import { Player } from '../../domain/player.orm.domain';
import { Statistic } from '../../domain/statistic.orm.domain';

@Injectable()
export class QuizGameRepository {
  constructor(
    @InjectRepository(Game) private readonly gameRepository: Repository<Game>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Statistic)
    private readonly statisticRepository: Repository<Statistic>,
  ) {}

  async findActiveOrPendingGameForUser(userId: number) {
    return this.gameRepository
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.players', 'player')
      .where('player.userId = :userId', { userId })
      .andWhere('game.status IN (:...statuses)', {
        statuses: [GameStatusType.Active, GameStatusType.PendingSecondPlayer],
      })
      .getOne();
  }

  findStatisticsByUserId(userId: number) {
    return this.statisticRepository
      .createQueryBuilder('stat')
      .where('stat.userId = :userId', { userId })
      .getOne();
  }

  async findPendingGame() {
    return this.gameRepository
      .createQueryBuilder('game')
      .innerJoinAndSelect('game.players', 'player')
      .where('game.status = :status', {
        status: GameStatusType.PendingSecondPlayer,
      })
      .setLock('pessimistic_write')
      .getOne();
  }

  async findFiveRandomQuestions() {
    const questions: Question[] = await this.questionRepository
      .createQueryBuilder('q')
      .where('q.published is TRUE')
      .orderBy(`RANDOM()`)
      .limit(5)
      .getMany();

    if (!questions.length) {
      throw new NotFoundException('No published questions.');
    }
    return questions;
  }

  async save(gameToSave: Game) {
    return this.gameRepository.save(gameToSave);
  }

  async saveStatistic(stats: Statistic) {
    return this.statisticRepository.save(stats);
  }
  async findActiveGame(userId: number) {
    const activeGame: Game | null = await this.gameRepository
      .createQueryBuilder('game')
      .innerJoinAndSelect('game.gameQuestions', 'gq')
      .setLock('pessimistic_write')
      .innerJoinAndSelect('gq.question', 'question')
      .leftJoinAndSelect('game.players', 'p')
      .leftJoinAndSelect('p.answers', 'a', 'a.gameId = p.gameId')
      .innerJoin(
        'game.players',
        'playerFilter',
        'playerFilter.userId = :userId',
        { userId },
      )
      .where('game.status IN (:...statuses)', {
        statuses: [GameStatusType.Active],
      })
      .setLock('pessimistic_write', undefined, ['game'])
      .getOne();
    if (!activeGame) {
      throw new ForbiddenException('Game not found.');
    }

    return activeGame;
  }
}
