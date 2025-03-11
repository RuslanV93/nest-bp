import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRefreshContextDto } from '../../../auth/guards/dto/user-context.dto';
import { ClientInfoDto } from '../../types/client-info.dto';
import { DeviceDomainDto } from '../../domain/dto/device.domain-dto';
import { SqlDomainDevice } from '../../domain/devices.domain';
import { DevicesSqlRepository } from '../../infrastructure/repositories/devices.sql.repository';

export class UpdateDeviceCommand {
  constructor(
    public session: SqlDomainDevice,
    public user: UserRefreshContextDto,
    public clientInfo: ClientInfoDto,
    public sessionVersion: string,
  ) {}
}

@CommandHandler(UpdateDeviceCommand)
export class UpdateDeviceUseCase
  implements ICommandHandler<UpdateDeviceCommand>
{
  constructor(private readonly devicesRepository: DevicesSqlRepository) {}
  async execute(command: UpdateDeviceCommand) {
    const title = `Device: ${command.clientInfo.device || 'other'},
     Platform: ${command.clientInfo.os || 'other'}, Browser: ${command.clientInfo.browser || 'other'}`;
    const updateDto: DeviceDomainDto = {
      userId: command.user.id.toString(),
      ip: command.clientInfo.ip,
      title: title,
      tokenVersion: command.sessionVersion,
      deviceId: command.user.deviceId,
    };
    command.session.updateSession(updateDto);
    await this.devicesRepository.updateSession(command.session);
  }
}
