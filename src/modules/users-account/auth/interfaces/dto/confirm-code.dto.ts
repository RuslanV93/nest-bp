import { IsStringWithTrim } from '../../../../../core/decorators/validation/isStringWithTrim';
import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmCodeDto {
  @ApiProperty()
  @IsStringWithTrim(1, 100)
  code: string;
}

export class EmailResendingDto {
  @ApiProperty()
  @IsStringWithTrim(2, 100)
  @IsEmail()
  email: string;
}
