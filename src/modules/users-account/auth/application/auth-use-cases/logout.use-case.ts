import { UserRefreshContextDto } from '../../guards/dto/user-context.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnauthorizedDomainException } from '../../../../../core/exceptions/domain-exception';
import { DevicesSqlRepository } from '../../../devices/infrastructure/repositories/devices.sql.repository';

export class LogoutCommand {
  constructor(public user: UserRefreshContextDto) {}
}

@CommandHandler(LogoutCommand)
export class LogoutUseCase implements ICommandHandler<LogoutCommand> {
  constructor(private readonly devicesRepository: DevicesSqlRepository) {}
  async execute(command: LogoutCommand) {
    const session = await this.devicesRepository.findSessionByTokenVersion(
      command.user.exp,
      command.user.id,
    );
    console.log(session);
    if (!session) {
      throw UnauthorizedDomainException.create('Unauthorized here');
    }

    await this.devicesRepository.deleteDevice(session);
  }
}
