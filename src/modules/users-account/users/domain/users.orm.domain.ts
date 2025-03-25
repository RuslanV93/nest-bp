import { Column, Entity, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../../shared/types/base.entity.type';
import { EmailInfo } from './email-info.orm.domain';
import { PasswordInfo } from './password-info.orm.domain';

@Entity()
export class User extends BaseEntity {
  @Column()
  login: string;

  @Column()
  email: string;

  @OneToOne(() => EmailInfo, { cascade: true })
  emailConfirmationInfo: EmailInfo;

  @OneToOne(() => PasswordInfo, { cascade: true })
  passwordInfo: PasswordInfo;

  static createInstance(
    login: string,
    email: string,
    password: string,
    emailConfirmCode: string,
  ) {
    const now = new Date();
    const user = new this();
    const emailInfo = new EmailInfo();
    const passwordInfo = new PasswordInfo();
    user.login = login;
    user.email = email;

    /// Email confirmation info
    emailInfo.confirmCode = emailConfirmCode;
    emailInfo.codeExpirationDate = new Date(
      now.getTime() + 24 * 60 * 60 * 1000,
    );
    emailInfo.isConfirmed = false;
    emailInfo.emailConfirmationCooldown = new Date(
      now.getTime() + 10 * 60 * 1000,
    );

    /// Password info
    passwordInfo.passwordHash = password;
    passwordInfo.passwordRecoveryCode = null;

    user.emailConfirmationInfo = emailInfo;
    user.passwordInfo = passwordInfo;

    return user;
  }
}
