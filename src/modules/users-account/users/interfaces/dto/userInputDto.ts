import { ApiProperty } from '@nestjs/swagger';
import { IsStringWithTrim } from '../../../../../core/decorators/validation/isStringWithTrim';
import {
  userEmailConstraints,
  userLoginConstraints,
  userPasswordConstraints,
} from '../../constants/users-constants';
import { Matches } from 'class-validator';

export class UserInputDto {
  @ApiProperty()
  @IsStringWithTrim(
    userLoginConstraints.minLength,
    userLoginConstraints.maxLength,
  )
  login: string;

  @ApiProperty()
  @IsStringWithTrim(
    userPasswordConstraints.minLength,
    userPasswordConstraints.maxLength,
  )
  password: string;
  @ApiProperty()
  @Matches(userEmailConstraints.pattern)
  email: string;
}
