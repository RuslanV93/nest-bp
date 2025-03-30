import { UserRefreshContextDto } from '../../guards/dto/user-context.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnauthorizedDomainException } from '../../../../../core/exceptions/domain-exception';
import { DevicesOrmRepository } from '../../../devices/infrastructure/repositories/devices.orm.repository';
import { Device } from '../../../devices/domain/devices.orm.domain';

export class LogoutCommand {
  constructor(public user: UserRefreshContextDto) {}
}

@CommandHandler(LogoutCommand)
export class LogoutUseCase implements ICommandHandler<LogoutCommand> {
  constructor(private readonly devicesRepository: DevicesOrmRepository) {}
  async execute(command: LogoutCommand) {
    const session: Device | null =
      await this.devicesRepository.findSessionByDeviceIdAndUserId(
        command.user.deviceId,
        command.user.id,
      );
    if (!session || session.tokenVersion !== command.user.exp.toString()) {
      throw UnauthorizedDomainException.create('Unauthorized here');
    }
    await this.devicesRepository.deleteDevice(session);
  }
}
