/** Users inner object type. Email confirmation field types*/
export type EmailConfirmationInfoType = {
  confirmCode: string;
  codeExpirationDate: Date;
  isConfirmed: boolean;
  emailConfirmationCooldown: Date;
};

/** Users inner object type. Password information, hash, recovery code */
export type PasswordInfoType = {
  passwordHash: string;
  passwordRecoveryCode: string;
  passwordRecoveryCodeExpirationDate: Date;
};

/**
 * Represents the User domain object type.
 * Contains all fields of the UserModel, suitable for creating an instance of the UserModel class.
 */
export type UserDomainDto = {
  login: string;
  email: string;
  emailConfirmationInfo: EmailConfirmationInfoType;
  passwordInfo: PasswordInfoType;
};
