import { Column, Entity, Index, OneToMany, OneToOne } from 'typeorm';
import { BazaEntity } from '../../../../shared/types/base.entity.type';
import { EmailInfo } from './email-info.orm.domain';
import { PasswordInfo } from './password-info.orm.domain';
import { Device } from '../../devices/domain/devices.orm.domain';
import { BadRequestDomainException } from '../../../../core/exceptions/domain-exception';
import { CryptoService } from '../../auth/application/crypto.service';
import { LikeDislike } from '../../../blogger-platform/likes/domain/like.orm.domain';
import { Player } from '../../../quiz-game/pair-game-quiz/domain/player.orm.domain';

@Entity()
@Index('idx_user_not_deleted', ['deletedAt'], {
  where: `"deleted_at" IS NULL`,
})
export class User extends BazaEntity {
  @Column()
  login: string;

  @Column()
  email: string;

  @OneToMany(() => Player, (player) => player.user)
  players: Player[];

  @OneToOne(() => EmailInfo, (e) => e.user, { cascade: true, eager: true })
  emailConfirmationInfo: EmailInfo;

  @OneToOne(() => PasswordInfo, (p) => p.user, {
    cascade: true,
    eager: true,
  })
  passwordInfo: PasswordInfo;

  @OneToMany(() => Device, (device) => device.user)
  devices: Device[];

  @OneToMany(() => LikeDislike, (like) => like.user)
  like: LikeDislike[];

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
  static validateEmailConfirmation(user: User, confirmCode: string) {
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
