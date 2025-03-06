import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

import { UserDomainDto } from './dto/user.domain-dto';
import { Optional } from '@nestjs/common';

@Schema({ _id: false, versionKey: false })
class EmailConfirmationInfo {
  @Prop({ type: String, nullable: true })
  confirmCode: string | null;

  @Prop({ type: Date, nullable: true })
  codeExpirationDate: Date | null;

  @Prop()
  isConfirmed: boolean;

  @Prop({ type: Date, nullable: true })
  emailConfirmationCooldown: Date | null;
}

@Schema({ _id: false, versionKey: false })
class PasswordInfo {
  @Prop()
  passwordHash: string;

  @Prop({ type: String, nullable: true })
  passwordRecoveryCode: string | null;

  @Prop({ type: String, nullable: true })
  passwordRecoveryCodeExpirationDate: Date | null;
}

@Schema({ _id: false, timestamps: true })
export class User {
  @Prop()
  login: string;

  @Prop()
  email: string;

  @Optional()
  @Prop({ type: () => EmailConfirmationInfo })
  emailConfirmationInfo: EmailConfirmationInfo;

  @Optional()
  @Prop({ type: () => PasswordInfo })
  passwordInfo: PasswordInfo;

  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: Date, nullable: true })
  deletedAt: Date | null;

  static createInstance(
    this: UserModelType,
    userDomainDto: UserDomainDto,
  ): UserDocument {
    const user = new this();
    user.login = userDomainDto.login;
    user.email = userDomainDto.email;
    user.emailConfirmationInfo = userDomainDto.emailConfirmationInfo;
    user.passwordInfo = userDomainDto.passwordInfo;
    user.deletedAt = null;
    return user;
  }
  setPasswordRecoveryInfo(recoveryCode: string) {
    this.passwordInfo.passwordRecoveryCode = recoveryCode;
    this.passwordInfo.passwordRecoveryCodeExpirationDate = new Date(
      Date.now() + 60 * 60 * 1000,
    );
  }

  /** Set confirmation code*/
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
  /** Confirm email. Set isConfirmed field */
  confirmEmail() {
    this.emailConfirmationInfo.isConfirmed = true;
  }

  /** Update password */
  updatePassword(newPasswordHash: string) {
    this.passwordInfo.passwordHash = newPasswordHash;
    this.passwordInfo.passwordRecoveryCode = null;
    this.passwordInfo.passwordRecoveryCodeExpirationDate = null;
    return this;
  }

  /** Soft delete, set delete date. entity doesn't dropping from db */
  deleteUser() {
    if (this.deletedAt !== null) {
      throw new Error('User not Found');
    }
    this.deletedAt = new Date();
    return this.deletedAt;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.loadClass(User);
export type UserDocument = HydratedDocument<User>;
export type UserModelType = Model<UserDocument> & typeof User;
