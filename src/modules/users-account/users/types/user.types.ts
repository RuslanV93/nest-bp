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
  _id: number;
  login: string;
  email: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt?: Date | null;
} & EmailInfoType &
  PasswordInfoType;
