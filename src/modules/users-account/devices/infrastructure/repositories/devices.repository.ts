import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Device,
  DeviceDocument,
  DeviceModelType,
} from '../../domain/devices.model';
import { ObjectId } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class DevicesRepository {
  constructor(
    @InjectModel(Device.name) private readonly DeviceModel: DeviceModelType,
  ) {}
  async findOneByDeviceId(deviceId: string) {
    return this.DeviceModel.findOne({
      deviceId: deviceId,
      deletedAt: null,
    });
  }
  async findSessionByTokenVersion(tokenVersion: string, userId: ObjectId) {
    const session: DeviceDocument | null = await this.DeviceModel.findOne({
      tokenVersion: tokenVersion,
      userId: userId,
      deletedAt: null,
    });

    return session;
  }
  async findOrNotFoundException(deviceId: string) {
    const device = await this.findOneByDeviceId(deviceId);
    if (!device) {
      throw new NotFoundException('Device does not exist.');
    }
    return device;
  }
  async findAll(userId: ObjectId, deviceId: string): Promise<DeviceDocument[]> {
    const devices = await this.DeviceModel.find({
      userId: userId,
      deviceId: { $ne: deviceId },
    });
    if (!devices) {
      throw new NotFoundException('Device does not exist.');
    }
    return devices;
  }
  async save(device: DeviceDocument) {
    return device.save();
  }
}
