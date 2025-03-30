import { EmailResendingDto } from '../../../auth/interfaces/dto/confirm-code.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestDomainException } from '../../../../../core/exceptions/domain-exception';
import { randomUUID } from 'node:crypto';
import { ServiceResultObjectFactory } from '../../../../../shared/utils/serviceResultObject';
import { EmailService } from '../../../../notification/application/email.service';
import { UsersOrmRepository } from '../../infrastructure/repositories/users.orm.repository';
import { User } from '../../domain/users.orm.domain';

export class EmailResendCommand {
  constructor(public emailResendingDto: EmailResendingDto) {}
}

@CommandHandler(EmailResendCommand)
export class EmailResendUseCase implements ICommandHandler<EmailResendCommand> {
  constructor(
    private readonly usersRepository: UsersOrmRepository,
    private readonly emailService: EmailService,
  ) {}
  async execute(command: EmailResendCommand) {
    const user: User | null =
      await this.usersRepository.findByEmailAndLoginField(
        command.emailResendingDto.email,
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

    this.emailService.resendConfirmationEmail(
      user.email,
      user.login,
      emailConfirmCode,
    );
    await this.usersRepository.save(user);
    return ServiceResultObjectFactory.successResultObject();
  }
}
