import { EmailResendingDto } from '../../interfaces/dto/confirm-code.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserDocument } from '../../../users/domain/users.model';
import { BadRequestDomainException } from '../../../../../core/exceptions/domain-exception';
import { randomUUID } from 'node:crypto';
import { ServiceResultObjectFactory } from '../../../../../shared/utils/serviceResultObject';
import { UsersRepository } from '../../../users/infrastructure/repositories/users.repository';
import { EmailService } from '../../../../notification/application/email.service';

export class EmailResendCommand {
  constructor(public emailResendingDto: EmailResendingDto) {}
}

@CommandHandler(EmailResendCommand)
export class EmailResendUseCase implements ICommandHandler<EmailResendCommand> {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly emailService: EmailService,
  ) {}
  async execute(command: EmailResendCommand) {
    const user: UserDocument | null =
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
    this.emailService.sendConfirmationEmail(
      user.email,
      user.login,
      emailConfirmCode,
    );
    await this.usersRepository.save(user);
    return ServiceResultObjectFactory.successResultObject();
  }
}
