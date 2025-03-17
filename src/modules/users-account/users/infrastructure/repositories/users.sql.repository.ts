import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ObjectId } from 'mongodb';
import { UserDocument } from '../../domain/users.model';
import { BadRequestDomainException } from '../../../../../core/exceptions/domain-exception';
import {
  SqlDomainUser,
  UserSqlEntityType,
} from '../../domain/users.sql.domain';

@Injectable()
export class UsersSqlRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async findById(id: ObjectId): Promise<UserDocument | null> {
    const users: UserDocument[] = await this.dataSource.query(
      `
          SELECT u.*, e.*, p.*
          FROM public."USERS" u
                   LEFT JOIN public."EMAIL_CONFIRMATION_INFO" e ON u._id = e."userId"
                   LEFT JOIN public."PASSWORD_INFO" p ON u._id = p."userId"
          WHERE u._id = $1 AND u."deletedAt" IS NULL
    `,
      [id.toString()],
    );

    return users[0];
  }
  async findExistingUserByLoginOrEmail(login: string, email: string) {
    const users: UserSqlEntityType[] = await this.dataSource.query(
      `
          SELECT u.*,
                 CASE
                     WHEN u.login = $1 THEN 'login'
                     WHEN u.email = $2 THEN 'email'
                     END AS field
          FROM "USERS" u
          WHERE u."deletedAt" IS NULL
            AND (u.login = $1 OR u.email = $2)
              LIMIT 1;
      `,
      [login, email],
    );
    if (!users.length) {
      return null;
    }
    const user = SqlDomainUser.fromSqlResult(users[0]);
    return user.login === login
      ? { user, field: 'login' }
      : { user, field: 'email' };
  }
  async findByEmailConfirmCode(confirmCode: string) {
    const users: UserSqlEntityType[] = await this.dataSource.query(
      `
    SELECT u.*, e.*, p.*
    FROM "USERS" u
            LEFT JOIN "EMAIL_CONFIRMATION_INFO" e ON u._id = e."userId"
            LEFT JOIN "PASSWORD_INFO" p ON u._id = p."userId"
    WHERE u."deletedAt" IS NULL AND e."confirmCode" = $1
    `,
      [confirmCode],
    );
    if (!users.length) {
      throw BadRequestDomainException.create(
        'Confirm code is incorrect',
        'code',
      );
    }
    return SqlDomainUser.fromSqlResult(users[0]);
  }

  async findByPasswordConfirmCode(passwordConfirmCode: string) {
    const users: UserSqlEntityType[] = await this.dataSource.query(
      `
          SELECT u.*, e.*, p.*
          FROM "USERS" u
                   LEFT JOIN "EMAIL_CONFIRMATION_INFO" e ON u._id = e."userId"
                   LEFT JOIN "PASSWORD_INFO" p ON u._id = p."userId"
          WHERE u."deletedAt" IS NULL
            AND p."passwordRecoveryCode" = $1
              LIMIT 1;
      `,
      [passwordConfirmCode],
    );

    if (!users.length) {
      throw BadRequestDomainException.create(
        'User does not exist',
        'recoveryCode',
      );
    }

    return SqlDomainUser.fromSqlResult(users[0]);
  }
  async findByEmailAndLoginField(loginOrEmail: string) {
    const query = `
        SELECT u.*, p.*, e.*
        FROM "USERS" u
                 LEFT JOIN "PASSWORD_INFO" p ON p."userId" = u."_id"
                 LEFT JOIN "EMAIL_CONFIRMATION_INFO" e ON e."userId" = u."_id"
        WHERE u."deletedAt" IS NULL
          AND (
            LOWER(u.email) = LOWER($1)
                OR u.login = $1
            )
            LIMIT 1;
    `;

    const users: UserSqlEntityType[] = await this.dataSource.query(query, [
      loginOrEmail,
    ]);

    return users.length > 0 ? SqlDomainUser.fromSqlResult(users[0]) : null;
  }
  async findOrNotFoundException(id: ObjectId): Promise<UserDocument> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not Found');
    }

    return user;
  }

  /** CREATING NEW USER */
  async createUser(user: SqlDomainUser) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      interface UserInsertResult {
        _id: string;
      }
      const userInsertResult: UserInsertResult[] = await queryRunner.query(
        `
      INSERT INTO "USERS" (_id, login, email )
      VALUES ($1, $2, $3)
      RETURNING _id;
      `,
        [user._id.toString(), user.login, user.email],
      );
      const userId = userInsertResult[0]._id;

      await queryRunner.query(
        `
      INSERT INTO "EMAIL_CONFIRMATION_INFO" 
          ("confirmCode", "codeExpirationDate", "isConfirmed", "emailConfirmationCooldown", "userId")
      VALUES ($1, $2, $3, $4, $5)
      `,
        [
          user.emailConfirmationInfo.confirmCode,
          user.emailConfirmationInfo.codeExpirationDate,
          user.emailConfirmationInfo.isConfirmed,
          user.emailConfirmationInfo.emailConfirmationCooldown,
          userId,
        ],
      );

      await queryRunner.query(
        `
      INSERT INTO "PASSWORD_INFO"
        ("passwordHash", "userId")
      VALUES ($1, $2)
      `,
        [user.passwordInfo.passwordHash, userId],
      );
      await queryRunner.commitTransaction();

      return new ObjectId(userId);
    } catch (e) {
      console.log(e);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Something went wrong');
    } finally {
      await queryRunner.release();
    }
  }
  async deleteUser(user: UserDocument) {
    try {
      await this.dataSource.query(
        `
    UPDATE "USERS" 
    SET "deletedAt" = $1
    WHERE _id = $2
    `,
        [user.deletedAt, user._id],
      );
    } catch (error) {
      console.log(error);
    }
  }

  async registrationConfirm(user: SqlDomainUser) {
    await this.dataSource.query(
      `
    UPDATE "EMAIL_CONFIRMATION_INFO"
    SET "isConfirmed" = $1
    WHERE "userId" = $2
    `,
      [user.emailConfirmationInfo.isConfirmed, user._id],
    );
  }
  async updateEmailConfirmationCode(user: SqlDomainUser) {
    await this.dataSource.query(
      `
      UPDATE "EMAIL_CONFIRMATION_INFO"
      SET "confirmCode" = $1, "emailConfirmationCooldown" = $2, "codeExpirationDate" = $3
      WHERE "userId" = $4
      `,
      [
        user.emailConfirmationInfo.confirmCode,
        user.emailConfirmationInfo.emailConfirmationCooldown,
        user.emailConfirmationInfo.codeExpirationDate,
        user._id,
      ],
    );
  }
  async setPasswordRecoveryInfo(user: SqlDomainUser) {
    await this.dataSource.query(
      `
    UPDATE "PASSWORD_INFO"
    SET "passwordRecoveryCode" = $1, "passwordRecoveryCodeExpirationDate" = $2
    WHERE "userId" = $3
    `,
      [
        user.passwordInfo.passwordRecoveryCode,
        user.passwordInfo.passwordRecoveryCodeExpirationDate,
        user._id,
      ],
    );
  }
  async setNewPassword(user: SqlDomainUser) {
    await this.dataSource.query(
      `
    UPDATE "PASSWORD_INFO"
    SET "passwordRecoveryCode" = $1, "passwordRecoveryCodeExpirationDate" = $2, "passwordHash" = $3
    WHERE "userId" = $4
    `,
      [
        user.passwordInfo.passwordRecoveryCode,
        user.passwordInfo.passwordRecoveryCodeExpirationDate,
        user.passwordInfo.passwordHash,
        user._id,
      ],
    );
  }
}
