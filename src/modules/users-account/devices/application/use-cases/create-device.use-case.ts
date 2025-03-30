import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ClientInfoDto } from '../../types/client-info.dto';

import { DeviceDomainDto } from '../../domain/dto/device.domain-dto';
import { ObjectId } from 'mongodb';
import { DevicesOrmRepository } from '../../infrastructure/repositories/devices.orm.repository';
import { Device } from '../../domain/devices.orm.domain';

export class CreateDeviceCommand {
  constructor(
    public userId: ObjectId,
    public clientInfo: ClientInfoDto,
    public tokenVersion: string,
    public deviceId: string,
  ) {}
}

@CommandHandler(CreateDeviceCommand)
export class CreateDeviceUseCase
  implements ICommandHandler<CreateDeviceCommand>
{
  constructor(private readonly devicesRepository: DevicesOrmRepository) {}
  async execute(command: CreateDeviceCommand) {
    const title = `Device: ${command.clientInfo.device || 'other'},
     Platform: ${command.clientInfo.os || 'other'}, Browser: ${command.clientInfo.browser || 'other'}`;
    const newDeviceDto: DeviceDomainDto = {
      title: title,
      userId: command.userId.toString(),
      tokenVersion: command.tokenVersion,
      ip: command.clientInfo.ip,
      deviceId: command.deviceId,
    };
    const newDevice: Device = Device.createInstance(newDeviceDto);
    return this.devicesRepository.createDevice(newDevice);
  }
}
