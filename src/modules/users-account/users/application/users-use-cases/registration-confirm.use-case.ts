import { ConfirmCodeViewDto } from '../../../auth/interfaces/dto/confirm-code.dto';
import { CommandHandler } from '@nestjs/cqrs';
import { UsersOrmRepository } from '../../infrastructure/repositories/users.orm.repository';
import { User } from '../../domain/users.orm.domain';

export class RegistrationConfirmCommand {
  constructor(public confirmCodeDto: ConfirmCodeViewDto) {}
}
@CommandHandler(RegistrationConfirmCommand)
export class RegistrationConfirmUseCase {
  constructor(private readonly usersRepository: UsersOrmRepository) {}
  async execute(command: RegistrationConfirmCommand) {
    const user: User = await this.usersRepository.findByEmailConfirmCode(
      command.confirmCodeDto.code,
    );
    User.validateEmailConfirmation(user, command.confirmCodeDto.code);
    user.confirmEmail();
    await this.usersRepository.save(user);
    return user;
  }
}
