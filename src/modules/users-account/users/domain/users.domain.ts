import {
  EmailConfirmationInfoType,
  PasswordInfoType,
  UserDomainDto,
} from './dto/user.domain-dto';
import { BadRequestDomainException } from '../../../../core/exceptions/domain-exception';
import { UserDocument } from './users.model';
import { CryptoService } from '../../auth/application/crypto.service';

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
  static async validatePassword(
    oldPasswordHash: string,
    newPassword: string,
    cryptoService: CryptoService,
  ) {
    const passwordMatch = await cryptoService.comparePassword(
      newPassword,
      oldPasswordHash,
    );
    if (passwordMatch) {
      throw BadRequestDomainException.create(
        'The password must not match the old password.',
        'newPassword',
      );
    }
  }
  static validateEmailConfirmation(user: UserDocument, confirmCode: string) {
    if (user.emailConfirmationInfo.isConfirmed) {
      throw BadRequestDomainException.create(
        'Email is already confirmed',
        'code',
      );
    }
    if (
      user.emailConfirmationInfo.codeExpirationDate &&
      user.emailConfirmationInfo.codeExpirationDate < new Date()
    ) {
      throw BadRequestDomainException.create(
        'Confirmation expired',
        'confirm date',
      );
    }
    if (user.emailConfirmationInfo.confirmCode !== confirmCode) {
      throw BadRequestDomainException.create(
        'Invalid Confirmation Code',
        'code',
      );
    }
  }

  static create(login: string, email: string, password: string): DomainUser {
    const emailConfirmationInfo: EmailConfirmationInfoType = {
      confirmCode: null,
      codeExpirationDate: null,
      isConfirmed: false,
      emailConfirmationCooldown: null,
    };
    const passwordInfo: PasswordInfoType = {
      passwordHash: password,
      passwordRecoveryCode: null,
      passwordRecoveryCodeExpirationDate: null,
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
