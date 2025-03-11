import { PasswordRecoveryInputDto } from '../../../auth/interfaces/dto/password.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'node:crypto';
import { EmailService } from '../../../../notification/application/email.service';
import { UsersSqlRepository } from '../../infrastructure/repositories/users.sql.repository';
import { SqlDomainUser } from '../../domain/users.sql.domain';

export class PasswordRecoveryCommand {
  constructor(public passwordRecoveryDto: PasswordRecoveryInputDto) {}
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryUseCase
  implements ICommandHandler<PasswordRecoveryCommand>
{
  constructor(
    private readonly usersRepository: UsersSqlRepository,
    private readonly emailService: EmailService,
  ) {}
  async execute(command: PasswordRecoveryCommand) {
    const user: SqlDomainUser | null =
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
    await this.usersRepository.setPasswordRecoveryInfo(user);
    return user;
  }
}
