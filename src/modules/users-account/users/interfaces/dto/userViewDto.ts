import { UserDocument } from '../../domain/users.model';
import { ApiProperty, OmitType } from '@nestjs/swagger';

export class UserViewDto {
  @ApiProperty() id: string;
  @ApiProperty() login: string;
  @ApiProperty() email: string;
  @ApiProperty() createdAt: string;

  public static mapToView(this: void, user: UserDocument) {
    const dto = new UserViewDto();

    dto.id = user._id.toString();
    dto.login = user.login;
    dto.email = user.email;
    dto.createdAt = user.createdAt.toISOString();

    return dto;
  }
}

export class MeViewDto extends OmitType(UserViewDto, [
  'createdAt',
  'id',
] as const) {
  userId: string;

  static mapToView(user: UserDocument): MeViewDto {
    const dto = new MeViewDto();

    dto.email = user.email;
    dto.login = user.login;
    dto.userId = user._id.toString();

    return dto;
  }
}
