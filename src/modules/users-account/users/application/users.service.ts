import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserInputDto } from '../interfaces/dto/userInputDto';
import { DomainUser } from '../domain/users.domain';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModelType } from '../domain/users.model';
import { UsersRepository } from '../infrastructure/repositories/users.repository';
import { ObjectId } from 'mongodb';
import { ServiceResultObjectFactory } from '../../../../shared/utils/serviceResultObject';
import { BadRequestDomainException } from '../../../../core/exceptions/domain-exception';
import { CryptoService } from '../../auth/application/crypto.service';
import { randomUUID } from 'node:crypto';
import { isSuccess } from '../../../../shared/utils/isSuccessHelpFunction';
import { EmailService } from '../../../notification/application/email.service';
import {
  ConfirmCodeViewDto,
  EmailResendingDto,
} from '../../auth/interfaces/dto/confirm-code.dto';
import {
  PasswordUpdateInputDto,
  PasswordRecoveryInputDto,
} from '../../auth/interfaces/dto/password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private UserModel: UserModelType,
    private readonly usersRepository: UsersRepository,
    private readonly cryptoService: CryptoService,
    private readonly emailService: EmailService,
  ) {}
  /** User registration. Using createUser method */
  async registration(userDto: UserInputDto) {
    const registrationResult = await this.createUser(userDto);
    if (!isSuccess(registrationResult)) {
      throw new InternalServerErrorException();
    }
    const emailConfirmCode = randomUUID();
    const user = await this.usersRepository.findOrNotFoundException(
      registrationResult.data,
    );
    user.setEmailConfirmationCode(emailConfirmCode);
    this.emailService.sendConfirmationEmail(
      user.email,
      user.login,
      emailConfirmCode,
    );
    await this.usersRepository.save(user);
    return registrationResult;
  }
  /** Resend Email confirmation code*/
  async emailResend(emailResendingDto: EmailResendingDto) {
    const user: UserDocument | null =
      await this.usersRepository.findByEmailAndLoginField(
        emailResendingDto.email,
      );
    if (!user) {
      throw BadRequestDomainException.create('User not exists', 'email');
    }
    if (user.emailConfirmationInfo.isConfirmed) {
      throw BadRequestDomainException.create(
        'Email is already confirmed',
        'email',
      );
    }
    const emailConfirmCode = randomUUID();
    user.setEmailConfirmationCode(emailConfirmCode);
    this.emailService.sendConfirmationEmail(
      user.email,
      user.login,
      emailConfirmCode,
    );
    await this.usersRepository.save(user);
    return ServiceResultObjectFactory.successResultObject();
  }
  async confirmEmail(confirmCodeDto: ConfirmCodeViewDto) {
    const user: UserDocument =
      await this.usersRepository.findByEmailConfirmCode(confirmCodeDto.code);
    DomainUser.validateEmailConfirmation(user, confirmCodeDto.code);
    if (user.emailConfirmationInfo.isConfirmed) {
      return ServiceResultObjectFactory.internalErrorResultObject();
    }
    user.confirmEmail();
    await this.usersRepository.save(user);
    return ServiceResultObjectFactory.successResultObject(user);
  }

  /** Sending password recovery code */
  async passwordRecovery(passwordRecoveryDto: PasswordRecoveryInputDto) {
    const user: UserDocument | null =
      await this.usersRepository.findByEmailAndLoginField(
        passwordRecoveryDto.email,
      );
    if (!user) {
      return ServiceResultObjectFactory.successResultObject();
    }
    const recoveryCode = randomUUID();
    this.emailService.sendPasswordRecovery(
      user.email,
      user.login,
      recoveryCode,
    );
    user.setPasswordRecoveryInfo(recoveryCode);
    await this.usersRepository.save(user);
    return ServiceResultObjectFactory.successResultObject();
  }

  /** New password, and password info update */
  async passwordUpdate(passwordUpdateDto: PasswordUpdateInputDto) {
    const user = await this.usersRepository.findByPasswordConfirmCode(
      passwordUpdateDto.recoveryCode,
    );
    await DomainUser.validatePassword(
      user.passwordInfo.passwordHash,
      passwordUpdateDto.newPassword,
      this.cryptoService,
    );
    const newPasswordHash = await this.cryptoService.createPasswordHash(
      passwordUpdateDto.newPassword,
    );
    user.updatePassword(newPasswordHash);
    await this.usersRepository.save(user);
    return ServiceResultObjectFactory.successResultObject();
  }

  /** Creates new user entity and return */
  async createUser(userDto: UserInputDto) {
    const userWithTheSameLoginOrEmail =
      await this.usersRepository.findExistingUserByLoginOrEmail(
        userDto.login,
        userDto.email,
      );
    if (userWithTheSameLoginOrEmail) {
      throw BadRequestDomainException.create(
        'User login or email already taken',
        userWithTheSameLoginOrEmail.field,
      );
    }
    const passwordHash = await this.cryptoService.createPasswordHash(
      userDto.password,
    );

    const userEntity = DomainUser.create(
      userDto.login,
      userDto.email,
      passwordHash,
    );
    const user: UserDocument = this.UserModel.createInstance(
      userEntity.toSchema(),
    );
    const newUserId: ObjectId = await this.usersRepository.save(user);
    if (!newUserId) {
      return ServiceResultObjectFactory.internalErrorResultObject();
    }
    return ServiceResultObjectFactory.successResultObject(newUserId);
  }

  /** Delete existing user. Using soft deletion */
  async deleteUser(id: ObjectId) {
    const user = await this.usersRepository.findOrNotFoundException(id);
    try {
      const deleteDate = user.deleteUser();
      await this.usersRepository.save(user);
      return ServiceResultObjectFactory.successResultObject(deleteDate);
    } catch (error) {
      return ServiceResultObjectFactory.notFoundResultObject({
        message: error instanceof Error ? error.message : 'User not found',
      });
    }
  }
}
