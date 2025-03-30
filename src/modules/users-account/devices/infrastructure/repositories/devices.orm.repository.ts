import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Device } from '../../domain/devices.orm.domain';
import { IsNull, Not, Repository } from 'typeorm';
import { ObjectId } from 'mongodb';

@Injectable()
export class DevicesOrmRepository {
  constructor(
    @InjectRepository(Device)
    private readonly devicesRepository: Repository<Device>,
  ) {}

  async findOneByDeviceId(deviceId: string) {
    return this.devicesRepository.findOne({
      where: { deviceId: deviceId, deletedAt: IsNull() },
    });
  }

  async findSessionByDeviceIdAndUserId(deviceId: string, userId: ObjectId) {
    const session: Device | null = await this.devicesRepository.findOne({
      where: {
        deviceId: deviceId,
        userId: userId.toString(),
        deletedAt: IsNull(),
      },
    });
    return session;
  }

  async findOrNotFoundException(deviceId: string) {
    const device = await this.findOneByDeviceId(deviceId);
    if (!device) {
      throw new NotFoundException('Device not Found.');
    }
    return device;
  }

  async findAll(userId: ObjectId, deviceId: string) {
    const devices: Device[] = await this.devicesRepository.find({
      where: {
        userId: userId.toString(),
        deviceId: Not(deviceId),
        deletedAt: IsNull(),
      },
    });
    if (!devices.length) {
      throw new NotFoundException('Devices not found');
    }
    return devices;
  }
  async deleteDevice(devicesOrDevice: Device | Device[]) {
    if (Array.isArray(devicesOrDevice)) {
      await this.devicesRepository.softRemove(devicesOrDevice);
    } else {
      await this.devicesRepository.softRemove([devicesOrDevice]);
    }
  }
  async save(device: Device) {
    return this.devicesRepository.save(device);
  }
  async createDevice(newDevice: Device) {
    const device = this.devicesRepository.create(newDevice);
    const savedDevice = await this.devicesRepository.save(device);
    return savedDevice.deviceId;
  }
}
