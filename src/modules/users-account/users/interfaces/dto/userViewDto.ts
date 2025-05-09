import { ApiProperty, OmitType } from '@nestjs/swagger';
import { User } from '../../domain/users.orm.domain';
import { MeType } from '../../../auth/types/me.type';

export type UserFromSql = {
  _id: number;
  login: string;
  email: string;
  createdAt: Date;
  totalCount: number;
};

export class UserViewDto {
  @ApiProperty() id: string;
  @ApiProperty() login: string;
  @ApiProperty() email: string;
  @ApiProperty() createdAt: string;

  public static mapToView(this: void, user: User) {
    const dto = new UserViewDto();

    dto.id = user._id.toString();
    dto.login = user.login;
    dto.email = user.email;
    dto.createdAt = user.createdAt.toISOString();

    return dto;
  }
  // public static sqlMapToView(
  //   this: void,
  //   user: (Omit<UserDocument, '_id'> & { _id: string }) | UserFromSql,
  // ) {
  //   const dto = new UserViewDto();
  //   dto.id = user._id;
  //   dto.login = user.login;
  //   dto.email = user.email;
  //   dto.createdAt = user.createdAt.toISOString();
  //   return dto;
  // }
}

export class MeViewDto extends OmitType(UserViewDto, [
  'createdAt',
  'id',
] as const) {
  userId: number;

  static mapToView(user: MeType): MeViewDto {
    const dto = new MeViewDto();

    dto.email = user.email;
    dto.login = user.login;
    dto.userId = user._id;

    return dto;
  }
}
