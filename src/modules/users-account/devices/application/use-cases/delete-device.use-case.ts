import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ObjectId } from 'mongodb';
import { ForbiddenDomainException } from '../../../../../core/exceptions/domain-exception';
import { DevicesOrmRepository } from '../../infrastructure/repositories/devices.orm.repository';
import { Device } from '../../domain/devices.orm.domain';

export abstract class DeleteDeviceCommand {
  protected constructor(public readonly userId: ObjectId) {}
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
  constructor(private readonly devicesRepository: DevicesOrmRepository) {}
  async execute(command: DeleteOtherDevicesCommand) {
    const devices: Device[] = await this.devicesRepository.findAll(
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
  constructor(private readonly devicesRepository: DevicesOrmRepository) {}
  async execute(command: DeleteSpecifiedDeviceCommand) {
    const device: Device = await this.devicesRepository.findOrNotFoundException(
      command.deviceId,
    );

    if (device.userId.toString() !== command.userId.toString()) {
      throw ForbiddenDomainException.create();
    }
    await this.devicesRepository.deleteDevice(device);
  }
}
