import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserInputDto } from '../../interfaces/dto/userInputDto';
import { isSuccess } from '../../../../../shared/utils/isSuccessHelpFunction';
import { InternalServerErrorException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateUserCommand, CreateUserUseCase } from './create-user.use-case';
import { UsersRepository } from '../../infrastructure/repositories/users.repository';
import { EmailService } from '../../../../notification/application/email.service';
import { ResultObject } from '../../../../../shared/types/serviceResultObjectType';
import { ObjectId } from 'mongodb';

export class RegistrationCommand {
  constructor(public userDto: UserInputDto) {}
}
@CommandHandler(RegistrationCommand)
export class RegistrationUseCase
  implements ICommandHandler<RegistrationCommand>
{
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly usersRepository: UsersRepository,
    private readonly emailService: EmailService,
    private readonly commandBus: CommandBus,
  ) {}
  async execute(command: RegistrationCommand): Promise<ResultObject<ObjectId>> {
    const registrationResult: ResultObject<ObjectId> =
      await this.commandBus.execute(new CreateUserCommand(command.userDto));

    if (!isSuccess(registrationResult)) {
      throw new InternalServerErrorException();
    }
    const emailConfirmCode = randomUUID();
    const user = await this.usersRepository.findOrNotFoundException(
      registrationResult.data,
    );
    user.setEmailConfirmationCode(emailConfirmCode);
    this.emailService.sendConfirmationEmail(
      user.email,
      user.login,
      emailConfirmCode,
    );
    await this.usersRepository.save(user);
    return registrationResult;
  }
}
