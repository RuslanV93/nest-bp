import { IsStringWithTrim } from '../../../../../core/decorators/validation/isStringWithTrim';

export class CommentInputDto {
  @IsStringWithTrim(20, 300)
  content: string;
}
