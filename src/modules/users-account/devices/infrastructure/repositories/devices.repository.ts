import { Injectable } from '@nestjs/common';
import { DeviceDocument } from '../../domain/devices.model';

@Injectable()
export class DevicesRepository {
  constructor() {}
  async save(device: DeviceDocument) {
    return device.save();
  }
}
