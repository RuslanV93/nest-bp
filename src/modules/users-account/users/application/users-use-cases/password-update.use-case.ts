import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PasswordUpdateInputDto } from '../../../auth/interfaces/dto/password.dto';
import { CryptoService } from '../../../auth/application/crypto.service';
import { SqlDomainUser } from '../../domain/users.sql.domain';
import { UsersOrmRepository } from '../../infrastructure/repositories/users.orm.repository';
import { User } from '../../domain/users.orm.domain';

export class PasswordUpdateCommand {
  constructor(public passwordUpdateDto: PasswordUpdateInputDto) {}
}

@CommandHandler(PasswordUpdateCommand)
export class PasswordUpdateUseCase
  implements ICommandHandler<PasswordUpdateCommand>
{
  constructor(
    private readonly usersRepository: UsersOrmRepository,
    private readonly cryptoService: CryptoService,
  ) {}

  async execute(command: PasswordUpdateCommand) {
    const user = await this.usersRepository.findByPasswordRecoveryCode(
      command.passwordUpdateDto.recoveryCode,
    );
    await User.validatePassword(
      user.passwordInfo.passwordHash,
      command.passwordUpdateDto.newPassword,
      this.cryptoService,
    );
    const newPasswordHash = await this.cryptoService.createPasswordHash(
      command.passwordUpdateDto.newPassword,
    );
    user.updatePassword(newPasswordHash);
    await this.usersRepository.save(user);
    return user;
  }
}
