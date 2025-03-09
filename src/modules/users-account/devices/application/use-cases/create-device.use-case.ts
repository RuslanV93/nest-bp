import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ClientInfoDto } from '../../types/client-info.dto';
import {
  Device,
  DeviceDocument,
  DeviceModelType,
} from '../../domain/devices.model';
import { DeviceDomainDto } from '../../domain/dto/device.domain-dto';
import { ObjectId } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';
import { DevicesSqlRepository } from '../../infrastructure/repositories/devices.sql.repository';

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
  constructor(
    @InjectModel(Device.name) private DeviceModel: DeviceModelType,
    private readonly devicesRepository: DevicesSqlRepository,
  ) {}
  async execute(command: CreateDeviceCommand) {
    const title = `Device: ${command.clientInfo.device || 'other'},
     Platform: ${command.clientInfo.os || 'other'}, Browser: ${command.clientInfo.browser || 'other'}`;
    const newDeviceDto: DeviceDomainDto = {
      title: title,
      userId: command.userId,
      tokenVersion: command.tokenVersion,
      ip: command.clientInfo.ip,
      deviceId: command.deviceId,
    };
    const newDevice: DeviceDocument =
      this.DeviceModel.createInstance(newDeviceDto);
    return this.devicesRepository.createDevice(newDevice);
  }
}
