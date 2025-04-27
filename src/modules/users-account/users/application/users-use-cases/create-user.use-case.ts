import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserInputDto } from '../../interfaces/dto/userInputDto';
import { BadRequestDomainException } from '../../../../../core/exceptions/domain-exception';
import { ServiceResultObjectFactory } from '../../../../../shared/utils/serviceResultObject';
import { CryptoService } from '../../../auth/application/crypto.service';
import { randomUUID } from 'node:crypto';
import { UsersOrmRepository } from '../../infrastructure/repositories/users.orm.repository';
import { User } from '../../domain/users.orm.domain';

export class CreateUserCommand {
  constructor(public userDto: UserInputDto) {}
}
@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly usersRepository: UsersOrmRepository,
    private readonly cryptoService: CryptoService,
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

    const user = User.createInstance(
      command.userDto.login,
      command.userDto.email,
      passwordHash,
      emailConfirmCode,
    );
    const newUserId: number | null =
      await this.usersRepository.createUser(user);

    return ServiceResultObjectFactory.successResultObject({
      newUserId,
      emailConfirmCode,
    });
  }
}
