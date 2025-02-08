import { ApiProperty } from '@nestjs/swagger';

export class UserInputDto {
  @ApiProperty() login: string;
  @ApiProperty() password: string;
  @ApiProperty() email: string;
}
