import { ApiProperty } from '@nestjs/swagger';
import { Statistic } from '../../domain/statistic.orm.domain';

export class StatisticsViewDto {
  @ApiProperty() sumScore: number;
  @ApiProperty() avgScores: number;
  @ApiProperty() gamesCount: number;
  @ApiProperty() winsCount: number;
  @ApiProperty() lossesCount: number;
  @ApiProperty() drawsCount: number;

  static mapToView(stats: Statistic) {
    const dto = new StatisticsViewDto();
    dto.sumScore = stats.sumScore;
    dto.avgScores = stats.avgScores;
    dto.gamesCount = stats.gamesCount;
    dto.winsCount = stats.winsCount;
    dto.lossesCount = stats.lossesCount;
    dto.drawsCount = stats.drawsCount;
    return dto;
  }
}
