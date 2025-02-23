import { IsEnum } from 'class-validator';
import { LikeStatus } from '../../../likes/domain/dto/like.domain.dto';

export class LikeInputDto {
  @IsEnum(LikeStatus)
  likeStatus: LikeStatus;
}
