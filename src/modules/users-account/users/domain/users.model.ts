import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

import { UserDomainDto } from './dto/user.domain-dto';
import { Optional } from '@nestjs/common';

@Schema({ _id: false, versionKey: false })
class EmailConfirmationInfo {
  @Prop()
  confirmCode: string;

  @Prop()
  codeExpirationDate: Date;

  @Prop()
  isConfirmed: boolean;

  @Prop()
  emailConfirmationCooldown: Date;
}

@Schema({ _id: false, versionKey: false })
class PasswordInfo {
  @Prop()
  passwordHash: string;

  @Prop()
  passwordRecoveryCode: string;

  @Prop()
  passwordRecoveryCodeExpirationDate: Date;
}

@Schema({ timestamps: true })
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
