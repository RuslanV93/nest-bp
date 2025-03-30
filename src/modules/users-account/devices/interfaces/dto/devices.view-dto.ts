import { ApiProperty } from '@nestjs/swagger';
import { DeviceDocument } from '../../domain/devices.model';
import { Device } from '../../domain/devices.orm.domain';

export class DeviceViewDto {
  @ApiProperty()
  ip: string;
  @ApiProperty()
  title: string;
  @ApiProperty()
  lastActiveDate: string;
  @ApiProperty()
  deviceId: string;
  public static mapToView(this: void, device: DeviceDocument | Device) {
    return {
      ip: device.ip,
      title: device.title,
      lastActiveDate: device.lastActivity.toISOString(),
      deviceId: device.deviceId,
    };
  }
}
