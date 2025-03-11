import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ObjectId } from 'mongodb';
import { ForbiddenDomainException } from '../../../../../core/exceptions/domain-exception';
import { DevicesSqlRepository } from '../../infrastructure/repositories/devices.sql.repository';
import { SqlDomainDevice } from '../../domain/devices.domain';

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
    const devices: SqlDomainDevice[] = await this.devicesRepository.findAll(
      command.userId,
      command.deviceId,
    );

    await this.devicesRepository.deleteDevice(devices);
  }
}

@CommandHandler(DeleteSpecifiedDeviceCommand)
export class DeleteSpecifiedDeviceUseCase
  implements ICommandHandler<DeleteSpecifiedDeviceCommand>
{
  constructor(private readonly devicesRepository: DevicesSqlRepository) {}
  async execute(command: DeleteSpecifiedDeviceCommand) {
    const device: SqlDomainDevice =
      await this.devicesRepository.findOrNotFoundException(command.deviceId);

    if (device.userId.toString() !== command.userId.toString()) {
      throw ForbiddenDomainException.create();
    }
    await this.devicesRepository.deleteDevice(device);
  }
}
