import { IsStringWithTrim } from '../../../../../core/decorators/validation/isStringWithTrim';
import { ApiProperty } from '@nestjs/swagger';

export class LoginInputDto {
  @ApiProperty()
  @IsStringWithTrim(1, 100)
  loginOrEmail: string;

  @ApiProperty()
  @IsStringWithTrim(6, 20)
  password: string;
}
