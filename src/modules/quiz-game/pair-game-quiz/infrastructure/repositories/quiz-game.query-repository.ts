import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game, GameStatusType } from '../../domain/game.orm.domain';
import { Repository } from 'typeorm';
import { GameAnswer } from '../../domain/answer.orm.domain';

@Injectable()
export class QuizGameQueryRepository {
  constructor(
    @InjectRepository(Game) private readonly gameRepository: Repository<Game>,
    @InjectRepository(GameAnswer)
    private readonly gameAnswerRepository: Repository<GameAnswer>,
  ) {}

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
}
