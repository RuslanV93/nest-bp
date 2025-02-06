import { UserDocument } from '../../domain/users.model';

export class UserViewDto {
  id: string;
  login: string;
  email: string;
  createdAt: string;

  public static mapToView(this: void, user: UserDocument) {
    const dto = new UserViewDto();

    dto.id = user._id.toString();
    dto.login = user.login;
    dto.email = user.email;
    dto.createdAt = user.createdAt.toISOString();

    return dto;
  }
}
