import { ConfirmCodeViewDto } from '../../../auth/interfaces/dto/confirm-code.dto';
import { CommandHandler } from '@nestjs/cqrs';
import { UsersSqlRepository } from '../../infrastructure/repositories/users.sql.repository';
import { SqlDomainUser } from '../../domain/users.sql.domain';

export class RegistrationConfirmCommand {
  constructor(public confirmCodeDto: ConfirmCodeViewDto) {}
}
@CommandHandler(RegistrationConfirmCommand)
export class RegistrationConfirmUseCase {
  constructor(private readonly usersRepository: UsersSqlRepository) {}
  async execute(command: RegistrationConfirmCommand) {
    const user: SqlDomainUser =
      await this.usersRepository.findByEmailConfirmCode(
        command.confirmCodeDto.code,
      );
    SqlDomainUser.validateEmailConfirmation(user, command.confirmCodeDto.code);
    user.confirmEmail();
    await this.usersRepository.registrationConfirm(user);
    return user;
  }
}
