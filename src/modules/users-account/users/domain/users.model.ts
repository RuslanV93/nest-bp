import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

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

@Schema()
export class User {
  @Prop()
  login: string;

  @Prop()
  email: string;

  @Prop()
  createdAt: Date;

  @Prop({ type: () => EmailConfirmationInfo })
  emailConfirmationInfo: EmailConfirmationInfo;

  @Prop({ type: () => PasswordInfo })
  passwordInfo: PasswordInfo;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = HydratedDocument<User>;
export type UserModelType = Model<UserDocument>;
