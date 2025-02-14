import { IsStringWithTrim } from '../../../../../core/decorators/validation/isStringWithTrim';
import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PasswordRecoveryInputDto {
  @ApiProperty()
  @IsStringWithTrim(2, 100)
  @IsEmail()
  email: string;
}

export class PasswordUpdateInputDto {
  @ApiProperty()
  @IsStringWithTrim(6, 20)
  newPassword: string;

  @ApiProperty()
  @IsStringWithTrim(1, 100)
  recoveryCode: string;
}
