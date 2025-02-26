import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PasswordUpdateInputDto } from '../../../auth/interfaces/dto/password.dto';
import { DomainUser } from '../../domain/users.domain';
import { UsersRepository } from '../../infrastructure/repositories/users.repository';
import { CryptoService } from '../../../auth/application/crypto.service';

export class PasswordUpdateCommand {
  constructor(public passwordUpdateDto: PasswordUpdateInputDto) {}
}

@CommandHandler(PasswordUpdateCommand)
export class PasswordUpdateUseCase
  implements ICommandHandler<PasswordUpdateCommand>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly cryptoService: CryptoService,
  ) {}

  async execute(command: PasswordUpdateCommand) {
    const user = await this.usersRepository.findByPasswordConfirmCode(
      command.passwordUpdateDto.recoveryCode,
    );
    await DomainUser.validatePassword(
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
