import { AnswerInputDto } from '../interfaces/dto/answer.input-dto';
import { CommandHandler } from '@nestjs/cqrs';
import { QuizGameRepository } from '../infrastructure/repositories/quiz-game.repository';
import { UnitOfWork } from '../infrastructure/repositories/unit.of.work';
import { EntityManager } from 'typeorm';
import { logErrorToFile } from '../../../../../common/error-logger';
import {
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Game } from '../domain/game.orm.domain';

export class AnswerCommand {
  constructor(
    public answer: AnswerInputDto,
    public userId: number,
  ) {}
}

@CommandHandler(AnswerCommand)
export class AnswerUseCase {
  constructor(
    private readonly quizGameRepository: QuizGameRepository,
    private readonly unitOfWork: UnitOfWork,
  ) {}

  async execute(command: AnswerCommand) {
    return await this.unitOfWork.runTransaction(
      async (manager: EntityManager) => {
        try {
          const currentGame: Game =
            await this.quizGameRepository.findActiveGame(
              manager,
              command.userId,
            );
          const player = currentGame.players.find(
            (p) => p.id === command.userId,
          );
          if (!player) {
            throw new NotFoundException('Игрок не найден в текущей игре');
          }
          const playerAnswersCount = player.answers.length;
          const answers = player.answers;
          // логика ответа на вопрос. ДЕЛАЙ!
        } catch (e) {
          if (e instanceof HttpException) {
            throw e;
          }
          logErrorToFile(e);

          if (e instanceof Error) {
            console.log(e);
            throw new InternalServerErrorException(e.message);
          }
          throw new InternalServerErrorException('Something went wrong!');
        }
      },
    );
  }
}
