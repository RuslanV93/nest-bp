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
    public login: string,
    public email: string,
    public emailConfirmationInfo: EmailConfirmationInfoType,
    public passwordInfo: PasswordInfoType,
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

  static create(
    login: string,
    email: string,
    password: string,
    emailConfirmCode: string,
  ): DomainUser {
    const emailConfirmationInfo: EmailConfirmationInfoType = {
      confirmCode: emailConfirmCode,
      codeExpirationDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      isConfirmed: false,
      emailConfirmationCooldown: new Date(Date.now() + 10 * 60 * 1000),
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

class EmailConfirmationInfo {
  confirmCode: string | null;
  codeExpirationDate: Date | null;
  isConfirmed: boolean;
  emailConfirmationCooldown: Date | null;

  constructor(data: UserEntity) {
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

  constructor(data: UserEntity) {
    this.passwordHash = data.passwordHash;
    this.passwordRecoveryCode = data.passwordRecoveryCode || null;
    this.passwordRecoveryCodeExpirationDate =
      data.passwordRecoveryCodeExpirationDate
        ? new Date(data.passwordRecoveryCodeExpirationDate)
        : null;
  }
}
export type UserEntity = {
  _id: string;
  login: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  emailConfirmationId: number;
  confirmCode: string;
  codeExpirationDate: Date;
  isConfirmed: boolean;
  emailConfirmationCooldown?: Date | null;

  passwordInfoId: number;
  passwordHash: string;
  passwordRecoveryCode?: string | null;
  passwordRecoveryCodeExpirationDate?: Date | null;
  userId: string;
};

// Основной класс пользователя
export class User {
  _id: string;
  login: string;
  email: string;
  emailConfirmationInfo: EmailConfirmationInfo;
  passwordInfo: PasswordInfo;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  constructor(data: Omit<UserEntity, 'userId'>) {
    this._id = data._id;
    this.login = data.login;
    this.email = data.email;
    this.createdAt = new Date(data.createdAt);
    this.updatedAt = new Date(data.updatedAt);
    this.deletedAt = data.deletedAt ? new Date(data.deletedAt) : null;

    // Создаем вложенные объекты
    this.emailConfirmationInfo = new EmailConfirmationInfo({
      confirmCode: data.confirmCode,
      codeExpirationDate: data.codeExpirationDate,
      isConfirmed: data.isConfirmed,
      emailConfirmationCooldown: data.emailConfirmationCooldown,
    });

    this.passwordInfo = new PasswordInfo({
      passwordHash: data.passwordHash,
      passwordRecoveryCode: data.passwordRecoveryCode,
      passwordRecoveryCodeExpirationDate:
        data.passwordRecoveryCodeExpirationDate,
    });
  }

  // Статический метод для преобразования результата SQL запроса в объект User
  static fromSqlResult(sqlRow: UserEntity): User {
    const userData = {
      _id: sqlRow._id,
      login: sqlRow.login,
      email: sqlRow.email,
      createdAt: sqlRow.createdAt,
      updatedAt: sqlRow.updatedAt,
      deletedAt: sqlRow.deletedAt,

      // Поля из EMAIL_CONFIRMATION_INFO
      confirmCode: sqlRow.confirmCode,
      codeExpirationDate: sqlRow.codeExpirationDate,
      isConfirmed: sqlRow.isConfirmed,
      emailConfirmationCooldown: sqlRow.emailConfirmationCooldown,

      // Поля из PASSWORD_INFO
      passwordHash: sqlRow.passwordHash,
      passwordRecoveryCode: sqlRow.passwordRecoveryCode,
      passwordRecoveryCodeExpirationDate:
        sqlRow.passwordRecoveryCodeExpirationDate,
    };

    return new User(userData);
  }

  setPasswordRecoveryInfo(recoveryCode: string) {
    this.passwordInfo.passwordRecoveryCode = recoveryCode;
    this.passwordInfo.passwordRecoveryCodeExpirationDate = new Date(
      Date.now() + 60 * 60 * 1000,
    );
    return this;
  }

  setEmailConfirmationCode(confirmCode: string) {
    this.emailConfirmationInfo.confirmCode = confirmCode;
    this.emailConfirmationInfo.codeExpirationDate = new Date(
      Date.now() + 24 * 60 * 60 * 1000,
    );
    this.emailConfirmationInfo.emailConfirmationCooldown = new Date(
      Date.now() + 10 * 60 * 1000,
    );
    return this;
  }

  confirmEmail() {
    this.emailConfirmationInfo.isConfirmed = true;
    return this;
  }

  updatePassword(newPasswordHash: string) {
    this.passwordInfo.passwordHash = newPasswordHash;
    this.passwordInfo.passwordRecoveryCode = null;
    this.passwordInfo.passwordRecoveryCodeExpirationDate = null;
    return this;
  }

  deleteUser() {
    if (this.deletedAt !== null) {
      throw new Error('User not Found');
    }
    this.deletedAt = new Date();
    return this.deletedAt;
  }
}
// ЗАДАНИЕ!!!
/** ДОДЕЛАТЬ СУЩНОСТЬ, ДОДЕЛАТЬ АВТОРИЗАЦИОННЫЕ ЕНДПОЙНТЫ, АДАПТИРОВАТЬ СХЕМУ ДЛЯ СОЗДАНИЯ ОБЪЕКТА ИЗ ДАННЫХ КОТОРЫЕ
 *  ПРИХОДЯТ С БД.
 * */
