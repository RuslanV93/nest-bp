import { ApiProperty } from '@nestjs/swagger';
import { Game, GameStatusType } from '../../domain/game.orm.domain';
import { Player } from '../../domain/player.orm.domain';
import { AnswerStatus } from '../../types/answer.status.type';

type GameStatus = 'PendingSecondPlayer' | 'Active' | 'Finished';

class AnswerViewDto {
  questionId: string;
  answerStatus: AnswerStatus;
  addedAt: string;
}

class PlayerViewDto {
  id: string;
  login: string;
}

class PlayerProgressViewDto {
  answers: AnswerViewDto[];
  player: PlayerViewDto;
  score: number;
}

class QuestionViewDto {
  id: string;
  body: string;
}

export class GameViewDto {
  @ApiProperty() id: string;
  @ApiProperty({ type: PlayerProgressViewDto })
  firstPlayerProgress: PlayerProgressViewDto | null;
  @ApiProperty({ type: PlayerProgressViewDto })
  secondPlayerProgress: PlayerProgressViewDto | null;
  @ApiProperty({ type: [QuestionViewDto] }) questions: QuestionViewDto[] | null;
  @ApiProperty() status: GameStatus;
  @ApiProperty() pairCreatedDate: string;
  @ApiProperty() startGameDate: string | null;
  @ApiProperty() finishGameDate: string | null;

  public static mapToView(game: Game) {
    const dto = new GameViewDto();
    const sortedPlayers = game.players.sort((a, b) => a.id - b.id);
    const firstPlayer = sortedPlayers[0] || null;
    const secondPlayer = sortedPlayers.length > 1 ? sortedPlayers[1] : null;

    const questions =
      game.status === GameStatusType.PendingSecondPlayer
        ? null
        : game.gameQuestions
            .sort((a, b) => a.order - b.order)
            .map((question) => ({
              id: question.id.toString(),
              body: question.question.body,
            }));
    const getPlayerProgress = (player: Player | null) => {
      if (!player) return null;
      const answers = player.answers.map((answer) => ({
        questionId: answer.gameQuestionId.toString(),
        answerStatus: answer.status,
        addedAt: answer.date.toISOString(),
      }));
      return {
        answers,
        player: { id: player.userId.toString(), login: player.login },
        score: player.score,
      };
    };
    dto.id = game.id.toString();
    dto.firstPlayerProgress = getPlayerProgress(firstPlayer);
    dto.secondPlayerProgress = getPlayerProgress(secondPlayer);
    dto.questions = questions;
    dto.status = game.status;
    dto.pairCreatedDate = game.pairCreatedDate.toISOString();
    dto.startGameDate = game.startGameDate
      ? game.startGameDate.toISOString()
      : null;
    dto.finishGameDate = game.finishGameDate
      ? game.finishGameDate?.toISOString()
      : null;
    return dto;
  }
}
