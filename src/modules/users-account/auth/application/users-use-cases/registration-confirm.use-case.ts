import { ConfirmCodeViewDto } from '../../interfaces/dto/confirm-code.dto';
import { CommandHandler } from '@nestjs/cqrs';
import { UserDocument } from '../../../users/domain/users.model';
import { DomainUser } from '../../../users/domain/users.domain';
import { UsersRepository } from '../../../users/infrastructure/repositories/users.repository';

export class RegistrationConfirmCommand {
  constructor(public confirmCodeDto: ConfirmCodeViewDto) {}
}
@CommandHandler(RegistrationConfirmCommand)
export class RegistrationConfirmUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}
  async execute(command: RegistrationConfirmCommand) {
    const user: UserDocument =
      await this.usersRepository.findByEmailConfirmCode(
        command.confirmCodeDto.code,
      );
    DomainUser.validateEmailConfirmation(user, command.confirmCodeDto.code);

    user.confirmEmail();
    await this.usersRepository.save(user);
    return user;
  }
}
