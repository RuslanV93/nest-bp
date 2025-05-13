import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Game } from '../../domain/game.orm.domain';
import { Player } from '../../domain/player.orm.domain';
import { GameAnswer } from '../../domain/answer.orm.domain';

@Injectable()
export class GameService {
  constructor(
    @InjectQueue('game-finish-queue') private gameFinishQueue: Queue,
  ) {}
  async scheduleGameFinish(gameId: number) {
    console.log('from service');
    await this.gameFinishQueue.add(
      'finish-game',
      { gameId },
      {
        delay: 10000,
        removeOnComplete: true,
        removeOnFail: {
          count: 5,
        },
      },
    );
  }
  getPlayer(game: Game, userId: number) {
    const player = game.players.find((p) => p.userId === userId);
    if (!player) {
      throw new NotFoundException('');
    }
    return player;
  }

  getAnswers(player: Player) {
    const answers = player.answers;
    if (!answers) {
      return [];
    }
    return answers;
  }

  checkIsAllQuestionsAnswered(answers: GameAnswer[], currentGame: Game) {
    if (answers.length >= currentGame.gameQuestions.length) {
      console.log('from check');

      console.log('from check answers', answers);
      throw new ForbiddenException('You have already answered all questions');
    }
  }
  getNextQuestion(currentGame: Game, playerAnswersCount: number) {
    const sortedQuestions = currentGame.gameQuestions.sort(
      (a, b) => a.order - b.order,
    );

    const nextQuestion = sortedQuestions[playerAnswersCount];

    if (!nextQuestion) {
      throw new NotFoundException('Next question was not found!');
    }
    return nextQuestion;
  }
}
