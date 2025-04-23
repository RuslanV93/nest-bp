import { ApiProperty } from '@nestjs/swagger';
import { questionBodyConstraints } from '../../constants/question.constants';
import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';
import { IsStringWithTrim } from '../../../../../core/decorators/validation/isStringWithTrim';

export class QuestionInputDto {
  @ApiProperty()
  @IsStringWithTrim(
    questionBodyConstraints.minLength,
    questionBodyConstraints.maxLength,
  )
  body: string;

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  correctAnswers: string[];
}
