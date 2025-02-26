import { PasswordRecoveryInputDto } from '../../../auth/interfaces/dto/password.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserDocument } from '../../domain/users.model';
import { randomUUID } from 'node:crypto';
import { UsersRepository } from '../../infrastructure/repositories/users.repository';
import { EmailService } from '../../../../notification/application/email.service';

export class PasswordRecoveryCommand {
  constructor(public passwordRecoveryDto: PasswordRecoveryInputDto) {}
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryUseCase
  implements ICommandHandler<PasswordRecoveryCommand>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly emailService: EmailService,
  ) {}
  async execute(command: PasswordRecoveryCommand) {
    const user: UserDocument | null =
      await this.usersRepository.findByEmailAndLoginField(
        command.passwordRecoveryDto.email,
      );
    if (!user) {
      return user;
    }
    const recoveryCode = randomUUID();
    this.emailService.sendPasswordRecovery(
      user.email,
      user.login,
      recoveryCode,
    );
    user.setPasswordRecoveryInfo(recoveryCode);
    await this.usersRepository.save(user);
    return user;
  }
}
