import { ApiProperty } from '@nestjs/swagger';
import { Statistic } from '../../domain/statistic.orm.domain';

export class PlayerFromTop {
  id: string;
  login: string;
}
export class PlayerTopViewDto {
  @ApiProperty() sumScore: number;
  @ApiProperty() avgScores: number;
  @ApiProperty() gamesCount: number;
  @ApiProperty() winsCount: number;
  @ApiProperty() lossesCount: number;
  @ApiProperty() drawsCount: number;
  @ApiProperty() player: PlayerFromTop;

  static mapToView(stats: Statistic) {
    const dto = new PlayerTopViewDto();
    dto.sumScore = stats.sumScore;
    dto.avgScores = stats.avgScores;
    dto.gamesCount = stats.gamesCount;
    dto.winsCount = stats.winsCount;
    dto.lossesCount = stats.lossesCount;
    dto.drawsCount = stats.drawsCount;
    dto.player = {
      id: stats.userId.toString(),
      login: stats.user.login,
    };
    return dto;
  }
}
