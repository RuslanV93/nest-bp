import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRefreshContextDto } from '../../../auth/guards/dto/user-context.dto';
import { ClientInfoDto } from '../../types/client-info.dto';
import { DeviceDomainDto } from '../../domain/dto/device.domain-dto';
import { Device } from '../../domain/devices.orm.domain';
import { DevicesOrmRepository } from '../../infrastructure/repositories/devices.orm.repository';

export class UpdateDeviceCommand {
  constructor(
    public session: Device,
    public user: UserRefreshContextDto,
    public clientInfo: ClientInfoDto,
    public sessionVersion: string,
  ) {}
}

@CommandHandler(UpdateDeviceCommand)
export class UpdateDeviceUseCase
  implements ICommandHandler<UpdateDeviceCommand>
{
  constructor(private readonly devicesRepository: DevicesOrmRepository) {}
  async execute(command: UpdateDeviceCommand) {
    const title = `Device: ${command.clientInfo.device || 'other'},
     Platform: ${command.clientInfo.os || 'other'}, Browser: ${command.clientInfo.browser || 'other'}`;
    const updateDto: DeviceDomainDto = {
      userId: command.user.id,
      ip: command.clientInfo.ip,
      title: title,
      tokenVersion: command.sessionVersion,
      deviceId: command.user.deviceId,
    };
    command.session.updateSession(updateDto);
    await this.devicesRepository.save(command.session);
  }
}
