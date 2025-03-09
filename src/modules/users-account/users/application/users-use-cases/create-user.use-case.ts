import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserInputDto } from '../../interfaces/dto/userInputDto';
import { BadRequestDomainException } from '../../../../../core/exceptions/domain-exception';
import { DomainUser } from '../../domain/users.domain';
import { User, UserDocument, UserModelType } from '../../domain/users.model';
import { ObjectId } from 'mongodb';
import { ServiceResultObjectFactory } from '../../../../../shared/utils/serviceResultObject';
import { CryptoService } from '../../../auth/application/crypto.service';
import { InjectModel } from '@nestjs/mongoose';
import { ResultObject } from '../../../../../shared/types/serviceResultObjectType';
import { UsersSqlRepository } from '../../infrastructure/repositories/users.sql.repository';
import { randomUUID } from 'node:crypto';

export class CreateUserCommand {
  constructor(public userDto: UserInputDto) {}
}
@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly usersRepository: UsersSqlRepository,
    private readonly cryptoService: CryptoService,
    @InjectModel(User.name) private UserModel: UserModelType,
  ) {}
  async execute(
    command: CreateUserCommand,
  ): Promise<ResultObject<{ newUserId: ObjectId; emailConfirmCode: string }>> {
    const userWithTheSameLoginOrEmail =
      await this.usersRepository.findExistingUserByLoginOrEmail(
        command.userDto.login,
        command.userDto.email,
      );

    if (userWithTheSameLoginOrEmail) {
      throw BadRequestDomainException.create(
        'User login or email already taken',
        userWithTheSameLoginOrEmail.field,
      );
    }
    const passwordHash = await this.cryptoService.createPasswordHash(
      command.userDto.password,
    );
    const emailConfirmCode = randomUUID();
    const userEntity = DomainUser.create(
      command.userDto.login,
      command.userDto.email,
      passwordHash,
      emailConfirmCode,
    );

    const user: UserDocument = this.UserModel.createInstance(userEntity);
    const newUserId: ObjectId = await this.usersRepository.createUser(user);

    return ServiceResultObjectFactory.successResultObject({
      newUserId,
      emailConfirmCode,
    });
  }
}
