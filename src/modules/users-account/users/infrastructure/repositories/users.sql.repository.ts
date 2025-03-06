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

@Injectable()
export class UsersSqlRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async findById(id: ObjectId): Promise<UserDocument> {
    const users: UserDocument[] = await this.dataSource.query(
      `
          SELECT u.*, e.*, p.*
          FROM public."USERS" u
                   LEFT JOIN public."EMAIL_CONFIRMATION_INFO" e ON u.id = e."userId"
                   LEFT JOIN public."PASSWORD_INFO" p ON u.id = p."userId"
          WHERE u.id = $1 AND u."deletedAt" IS NULL
    `,
      [id.toString()],
    );
    return users[0];
  }
  async findExistingUserByLoginOrEmail(login: string, email: string) {
    const users: UserDocument[] = await this.dataSource.query(
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
    const user = users[0];
    return user.login === login
      ? { user, field: 'login' }
      : { user, field: 'email' };
  }
  async findByEmailConfirmCode(confirmCode: string) {
    const users: UserDocument[] = await this.dataSource.query(
      `
    SELECT u.*, e.*, p.*
    FROM "USERS" u
            LEFT JOIN "EMAIL_CONFIRMATION_INFO" e ON u.id = e."userId"
            LEFT JOIN "PASSWORD_INFO" p ON u.id = p."userId"
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
    return users[0];
  }

  async findByPasswordConfirmCode(passwordConfirmCode: string) {
    const users: UserDocument[] = await this.dataSource.query(
      `
          SELECT u.*
          FROM "USERS" u
                   LEFT JOIN "EMAIL_CONFIRMATION_INFO" e ON u.id = e."userId"
                   LEFT JOIN "PASSWORD_INFO" p ON u.id = p."userId"
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

    return users[0];
  }
  async findByEmailAndLoginField(
    loginOrEmail: string,
  ): Promise<UserDocument | null> {
    const query = `
    SELECT u.*
    FROM "USERS" u
    WHERE u."deletedAt" IS NULL
    AND (
      u.email = $1
      OR u.login = $1
    )
    LIMIT 1;
  `;

    const users: UserDocument[] = await this.dataSource.query(query, [
      loginOrEmail.toLowerCase(),
    ]);

    return users.length > 0 ? users[0] : null;
  }
  async findOrNotFoundException(id: ObjectId): Promise<UserDocument> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('User not Found');
    }
    return user;
  }

  async createUser(user: UserDocument) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    const id = new ObjectId();
    try {
      interface UserInsertResult {
        _id: string;
      }
      const userInsertResult = (await queryRunner.query(
        `
      INSERT INTO "USERS" (_id, login, email )
      VALUES ($1, $2, $3)
      RETURNING _id;
      `,
        [id.toString(), user.login, user.email],
      )) as UserInsertResult[];
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
    } catch {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Something went wrong');
    } finally {
      await queryRunner.release();
    }
  }
  async deleteUser(user: UserDocument) {
    await this.dataSource.query(
      `
    UPDATE "USERS" 
    SET "deletedAt" = $1
    WHERE id = $2
    `,
      [new Date(), user._id],
    );
  }
  async save(user: UserDocument) {
    let userId: ObjectId;
    if (user._id) {
      await this.deleteUser(user);
      return user._id;
    } else {
      userId = await this.createUser(user);
    }
    if (!userId) {
      throw new InternalServerErrorException();
    }
    return userId;
  }
}
