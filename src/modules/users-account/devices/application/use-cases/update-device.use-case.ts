import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DevicesRepository } from '../../infrastructure/repositories/devices.repository';
import { ObjectId } from 'mongodb';
import { DeviceDomainDto } from '../../domain/dto/device.domain-dto';
import { ClientInfoDto } from '../../types/client-info.dto';

export type DeviceUpdateDto = {
  tokenVersion: string;
  userId: ObjectId;
  clientInfo: ClientInfoDto;
  deviceId: string;
};
export class UpdateDeviceCommand {
  constructor(public updateDto: DeviceUpdateDto) {}
}

@CommandHandler(UpdateDeviceCommand)
export class UpdateDeviceUseCase
  implements ICommandHandler<UpdateDeviceCommand>
{
  constructor(private readonly devicesRepository: DevicesRepository) {}
  async execute(command: UpdateDeviceCommand) {
    const session = await this.devicesRepository.findSessionByTokenVersion(
      command.updateDto.tokenVersion,
      command.updateDto.userId,
    );
    const title = `Device: ${command.updateDto.clientInfo.device || 'other'},
     Platform: ${command.updateDto.clientInfo.os || 'other'}, Browser: ${command.updateDto.clientInfo.browser || 'other'}`;
    const updateDto: DeviceDomainDto = {
      userId: command.updateDto.userId,
      ip: command.updateDto.clientInfo.ip,
      title: title,
      tokenVersion: command.updateDto.tokenVersion,
      deviceId: command.updateDto.deviceId,
    };
    session.updateSession(updateDto);
    await this.devicesRepository.save(session);
    return session;
  }
}
