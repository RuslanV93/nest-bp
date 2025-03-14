import { BadRequestDomainException } from '../../../../core/exceptions/domain-exception';
import { ObjectId } from 'mongodb';
import { CryptoService } from '../../auth/application/crypto.service';

export type EmailInfoType = {
  confirmCode: string;
  codeExpirationDate: Date;
  isConfirmed: boolean;
  emailConfirmationCooldown?: Date | null;
};
export type PasswordInfoType = {
  passwordHash: string;
  passwordRecoveryCode: string | null;
  passwordRecoveryCodeExpirationDate?: Date | null;
};
export type UserSqlEntityType = {
  _id: string;
  login: string;
  email: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt?: Date | null;
} & EmailInfoType &
  PasswordInfoType;

class EmailConfirmationInfo {
  confirmCode: string | null;
  codeExpirationDate: Date | null;
  isConfirmed: boolean;
  emailConfirmationCooldown: Date | null;

  constructor(data: EmailInfoType) {
    this.confirmCode = data.confirmCode || null;
    this.codeExpirationDate = data.codeExpirationDate
      ? new Date(data.codeExpirationDate)
      : null;
    this.isConfirmed = data.isConfirmed || false;
    this.emailConfirmationCooldown = data.emailConfirmationCooldown
      ? new Date(data.emailConfirmationCooldown)
      : null;
  }
}

class PasswordInfo {
  passwordHash: string;
  passwordRecoveryCode: string | null;
  passwordRecoveryCodeExpirationDate: Date | null;

  constructor(data: PasswordInfoType) {
    this.passwordHash = data.passwordHash;
    this.passwordRecoveryCode = data.passwordRecoveryCode || null;
    this.passwordRecoveryCodeExpirationDate =
      data.passwordRecoveryCodeExpirationDate
        ? new Date(data.passwordRecoveryCodeExpirationDate)
        : null;
  }
}
// Основной класс пользователя
export class SqlDomainUser {
  _id: string;
  userId: string;
  login: string;
  email: string;
  emailConfirmationInfo: EmailConfirmationInfo;
  passwordInfo: PasswordInfo;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;

  constructor(data: UserSqlEntityType) {
    this._id = data._id;
    this.login = data.login;
    this.email = data.email;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.deletedAt = data.deletedAt ? data.deletedAt : null;

    this.emailConfirmationInfo = new EmailConfirmationInfo(data);
    this.passwordInfo = new PasswordInfo(data);
  }

  // Статический метод для преобразования результата SQL запроса в объект User
  static fromSqlResult(sqlRow: UserSqlEntityType): SqlDomainUser {
    return new SqlDomainUser(sqlRow);
  }
  static createInstance(
    login: string,
    email: string,
    password: string,
    emailConfirmCode: string,
  ): SqlDomainUser {
    const now = new Date();

    const newId = new ObjectId().toString();

    const user = new SqlDomainUser({
      _id: newId,
      login: login,
      email: email,

      // Email confirmation info
      confirmCode: emailConfirmCode,
      codeExpirationDate: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      isConfirmed: false,
      emailConfirmationCooldown: new Date(now.getTime() + 10 * 60 * 1000),

      // Password info
      passwordHash: password,
      passwordRecoveryCode: null,

      // Timestamps
      createdAt: null,
      updatedAt: null,
      deletedAt: null,
    });

    return user;
  }
  static validateEmailConfirmation(user: SqlDomainUser, confirmCode: string) {
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
  confirmEmail() {
    this.emailConfirmationInfo.isConfirmed = true;
  }
  setEmailConfirmationCode(confirmCode: string) {
    this.emailConfirmationInfo.confirmCode = confirmCode;
    this.emailConfirmationInfo.codeExpirationDate = new Date(
      new Date().getTime() + 24 * 60 * 60 * 1000,
    );
    this.emailConfirmationInfo.emailConfirmationCooldown = new Date(
      new Date().getTime() + 10 * 60 * 1000,
    );
  }
  setPasswordRecoveryInfo(recoveryCode: string) {
    this.passwordInfo.passwordRecoveryCode = recoveryCode;
    this.passwordInfo.passwordRecoveryCodeExpirationDate = new Date(
      Date.now() + 60 * 60 * 1000,
    );
  }
  updatePassword(newPasswordHash: string) {
    this.passwordInfo.passwordHash = newPasswordHash;
    this.passwordInfo.passwordRecoveryCode = null;
    this.passwordInfo.passwordRecoveryCodeExpirationDate = null;
    return this;
  }
}
