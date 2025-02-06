import {
  EmailConfirmationInfoType,
  PasswordInfoType,
  UserDomainDto,
} from './dto/user.domain-dto';

export class DomainUser {
  constructor(
    private login: string,
    private email: string,
    private emailConfirmationInfo: EmailConfirmationInfoType,
    private passwordInfo: PasswordInfoType,
  ) {
    this.validateFields();
  }
  private validateFields(): void {}

  static create(login: string, email: string, password: string): DomainUser {
    const emailConfirmationInfo: EmailConfirmationInfoType = {
      confirmCode: 'none',
      codeExpirationDate: new Date(),
      isConfirmed: true,
      emailConfirmationCooldown: new Date(Date.now() + 10 * 60 * 1000),
    };
    const passwordInfo: PasswordInfoType = {
      passwordHash: password,
      passwordRecoveryCode: 'none',
      passwordRecoveryCodeExpirationDate: new Date(
        Date.now() + 24 * 60 * 60 * 1000,
      ),
    };
    return new DomainUser(login, email, emailConfirmationInfo, passwordInfo);
  }
  toSchema(): UserDomainDto {
    return {
      login: this.login,
      email: this.email,
      emailConfirmationInfo: this.emailConfirmationInfo,
      passwordInfo: this.passwordInfo,
    };
  }
}
