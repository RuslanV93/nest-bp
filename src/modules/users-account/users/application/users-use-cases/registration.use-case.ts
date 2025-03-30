import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserInputDto } from '../../interfaces/dto/userInputDto';
import { isSuccess } from '../../../../../shared/utils/isSuccessHelpFunction';
import { InternalServerErrorException } from '@nestjs/common';
import { CreateUserCommand } from './create-user.use-case';
import { EmailService } from '../../../../notification/application/email.service';
import { ResultObject } from '../../../../../shared/types/serviceResultObjectType';
import { ObjectId } from 'mongodb';
import { UsersOrmRepository } from '../../infrastructure/repositories/users.orm.repository';

export class RegistrationCommand {
  constructor(public userDto: UserInputDto) {}
}
@CommandHandler(RegistrationCommand)
export class RegistrationUseCase
  implements ICommandHandler<RegistrationCommand>
{
  constructor(
    private readonly usersRepository: UsersOrmRepository,
    private readonly emailService: EmailService,
    private readonly commandBus: CommandBus,
  ) {}
  async execute(
    command: RegistrationCommand,
  ): Promise<ResultObject<{ newUserId: ObjectId; emailConfirmCode: string }>> {
    const registrationResult: ResultObject<{
      newUserId: ObjectId;
      emailConfirmCode: string;
    }> = await this.commandBus.execute(new CreateUserCommand(command.userDto));

    if (!isSuccess(registrationResult)) {
      throw new InternalServerErrorException(registrationResult.extensions);
    }
    const user = await this.usersRepository.findOrNotFoundException(
      registrationResult.data.newUserId,
    );

    await this.emailService.sendConfirmationEmail(
      user.email,
      user.login,
      registrationResult.data.emailConfirmCode,
    );

    return registrationResult;
  }
}
