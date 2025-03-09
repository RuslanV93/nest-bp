import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ObjectId } from 'mongodb';
import { DevicesRepository } from '../../infrastructure/repositories/devices.repository';
import { DeviceDocument } from '../../domain/devices.model';
import { ForbiddenDomainException } from '../../../../../core/exceptions/domain-exception';
import { DevicesSqlRepository } from '../../infrastructure/repositories/devices.sql.repository';

export abstract class DeleteDeviceCommand {
  constructor(public readonly userId: ObjectId) {}
}
export class DeleteSpecifiedDeviceCommand extends DeleteDeviceCommand {
  constructor(
    userId: ObjectId,
    public readonly deviceId: string,
  ) {
    super(userId);
  }
}
export class DeleteOtherDevicesCommand extends DeleteDeviceCommand {
  constructor(
    userId: ObjectId,
    public readonly deviceId: string,
  ) {
    super(userId);
  }
}

@CommandHandler(DeleteOtherDevicesCommand)
export class DeleteOtherDevicesUseCase
  implements ICommandHandler<DeleteOtherDevicesCommand>
{
  constructor(private readonly devicesRepository: DevicesSqlRepository) {}
  async execute(command: DeleteOtherDevicesCommand) {
    const devices: DeviceDocument[] = await this.devicesRepository.findAll(
      command.userId,
      command.deviceId,
    );
    for (const device of devices) {
      device.deletedAt = new Date();
    }
    await this.devicesRepository.deleteDevice(devices);
  }
}

@CommandHandler(DeleteSpecifiedDeviceCommand)
export class DeleteSpecifiedDeviceUseCase
  implements ICommandHandler<DeleteSpecifiedDeviceCommand>
{
  constructor(private readonly devicesRepository: DevicesSqlRepository) {}
  async execute(command: DeleteSpecifiedDeviceCommand) {
    const device: DeviceDocument =
      await this.devicesRepository.findOrNotFoundException(command.deviceId);
    if (device.userId.toString() !== command.userId.toString()) {
      throw ForbiddenDomainException.create();
    }
    device.deletedAt = new Date();
    await this.devicesRepository.deleteDevice(device);
  }
}
