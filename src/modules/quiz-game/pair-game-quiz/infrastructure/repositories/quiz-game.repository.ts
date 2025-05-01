import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game, GameStatusType } from '../../domain/game.orm.domain';
import { EntityManager, Repository } from 'typeorm';
import { Question } from '../../../question/domain/question.orm.domain';
import { GameAnswer } from '../../domain/answer.orm.domain';

@Injectable()
export class QuizGameRepository {
  constructor(
    @InjectRepository(Game) private readonly gameRepository: Repository<Game>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  async findPendingGame(manager: EntityManager) {
    return manager
      .getRepository(Game)
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
      .orderBy(`RANDOM()`)
      .limit(5)
      .getMany();

    if (!questions.length) {
      throw new NotFoundException();
    }
    return questions;
  }

  async connection() {}

  async answer() {}

  async save(gameToSave: Game, manager: EntityManager) {
    return manager.getRepository(Game).save(gameToSave);
  }

  async findActiveGame(manager: EntityManager, userId: number) {
    const activeGame = await manager
      .getRepository(Game)
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.questions', 'gq')
      .leftJoinAndSelect('game.player', 'p')
      .leftJoinAndSelect('p.answers', 'a')
      .where('p.userId = :userId', { userId })
      .andWhere('game.status = :status', { status: GameStatusType.Active })
      .getOne();
    if (!activeGame) {
      throw new NotFoundException('Game not found.');
    }
    return activeGame;
  }
}
