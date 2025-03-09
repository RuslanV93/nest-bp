import { ConfirmCodeViewDto } from '../../../auth/interfaces/dto/confirm-code.dto';
import { CommandHandler } from '@nestjs/cqrs';
import { UserDocument } from '../../domain/users.model';
import { DomainUser } from '../../domain/users.domain';
import { UsersSqlRepository } from '../../infrastructure/repositories/users.sql.repository';

export class RegistrationConfirmCommand {
  constructor(public confirmCodeDto: ConfirmCodeViewDto) {}
}
@CommandHandler(RegistrationConfirmCommand)
export class RegistrationConfirmUseCase {
  constructor(private readonly usersRepository: UsersSqlRepository) {}
  async execute(command: RegistrationConfirmCommand) {
    const user: UserDocument =
      await this.usersRepository.findByEmailConfirmCode(
        command.confirmCodeDto.code,
      );
    DomainUser.validateEmailConfirmation(user, command.confirmCodeDto.code);

    user.confirmEmail();
    await this.usersRepository.registrationConfirm(user);
    return user;
  }
}
