import { UserRefreshContextDto } from '../../guards/dto/user-context.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnauthorizedDomainException } from '../../../../../core/exceptions/domain-exception';
import { DevicesSqlRepository } from '../../../devices/infrastructure/repositories/devices.sql.repository';
import { SqlDomainDevice } from '../../../devices/domain/devices.domain';

export class LogoutCommand {
  constructor(public user: UserRefreshContextDto) {}
}

@CommandHandler(LogoutCommand)
export class LogoutUseCase implements ICommandHandler<LogoutCommand> {
  constructor(private readonly devicesRepository: DevicesSqlRepository) {}
  async execute(command: LogoutCommand) {
    const session: SqlDomainDevice | null =
      await this.devicesRepository.findSessionByDeviceId(
        command.user.deviceId,
        command.user.id,
      );
    if (!session || session.tokenVersion !== command.user.exp.toString()) {
      throw UnauthorizedDomainException.create('Unauthorized here');
    }
    await this.devicesRepository.deleteDevice(session);
  }
}
