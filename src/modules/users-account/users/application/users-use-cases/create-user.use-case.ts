import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserInputDto } from '../../interfaces/dto/userInputDto';
import { BadRequestDomainException } from '../../../../../core/exceptions/domain-exception';
import { User, UserModelType } from '../../domain/users.model';
import { ObjectId } from 'mongodb';
import { ServiceResultObjectFactory } from '../../../../../shared/utils/serviceResultObject';
import { CryptoService } from '../../../auth/application/crypto.service';
import { InjectModel } from '@nestjs/mongoose';
import { UsersSqlRepository } from '../../infrastructure/repositories/users.sql.repository';
import { randomUUID } from 'node:crypto';
import { SqlDomainUser } from '../../domain/users.sql.domain';

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
  async execute(command: CreateUserCommand) {
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

    const user = SqlDomainUser.createInstance(
      command.userDto.login,
      command.userDto.email,
      passwordHash,
      emailConfirmCode,
    );
    const newUserId: ObjectId = await this.usersRepository.createUser(user);

    return ServiceResultObjectFactory.successResultObject({
      newUserId,
      emailConfirmCode,
    });
  }
}
