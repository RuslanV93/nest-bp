import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AnswerInput {
  @ApiProperty()
  @IsString()
  answer: string;
}
