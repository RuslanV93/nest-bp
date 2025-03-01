import { ApiProperty } from '@nestjs/swagger';
import { DeviceDocument } from '../../domain/devices.model';

export class DeviceViewDto {
  @ApiProperty()
  ip: string;
  @ApiProperty()
  title: string;
  @ApiProperty()
  lastActiveDate: string;
  @ApiProperty()
  deviceId: string;
  public static mapToView(this: void, device: DeviceDocument) {
    return {
      ip: device.ip,
      title: device.title,
      lastActiveDate: device.lastActivity.toISOString(),
      deviceId: device.deviceId,
    };
  }
}
