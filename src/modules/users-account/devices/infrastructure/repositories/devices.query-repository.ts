import { Injectable, NotFoundException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';
import { Device, DeviceModelType } from '../../domain/devices.model';

@Injectable()
export class DevicesQueryRepository {
  constructor(@InjectModel(Device.name) private DeviceModel: DeviceModelType) {}

  async getDevices(userId: ObjectId) {
    const devices = await this.DeviceModel.find({
      userId: userId,
      deletedAt: null,
    });
    if (!devices) {
      throw new NotFoundException('Devices not found');
    }
    return devices;
  }
}
