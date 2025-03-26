import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PasswordUpdateInputDto } from '../../../auth/interfaces/dto/password.dto';
import { CryptoService } from '../../../auth/application/crypto.service';
import { UsersSqlRepository } from '../../infrastructure/repositories/users.sql.repository';
import { SqlDomainUser } from '../../domain/users.sql.domain';

export class PasswordUpdateCommand {
  constructor(public passwordUpdateDto: PasswordUpdateInputDto) {}
}

@CommandHandler(PasswordUpdateCommand)
export class PasswordUpdateUseCase
  implements ICommandHandler<PasswordUpdateCommand>
{
  constructor(
    private readonly usersRepository: UsersSqlRepository,
    private readonly cryptoService: CryptoService,
  ) {}

  async execute(command: PasswordUpdateCommand) {
    const user = await this.usersRepository.findByPasswordRecoveryCode(
      command.passwordUpdateDto.recoveryCode,
    );
    await SqlDomainUser.validatePassword(
      user.passwordInfo.passwordHash,
      command.passwordUpdateDto.newPassword,
      this.cryptoService,
    );
    const newPasswordHash = await this.cryptoService.createPasswordHash(
      command.passwordUpdateDto.newPassword,
    );
    user.updatePassword(newPasswordHash);
    await this.usersRepository.setNewPassword(user);
    return user;
  }
}
