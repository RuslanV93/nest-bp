import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Device } from '../../domain/devices.orm.domain';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class DevicesOrmQueryRepository {
  constructor(
    @InjectRepository(Device)
    private readonly devicesQueryRepository: Repository<Device>,
  ) {}

  async getDevices(userId: number) {
    const devices = await this.devicesQueryRepository.find({
      where: { userId: userId, deletedAt: IsNull() },
    });
    if (!devices) {
      throw new NotFoundException('Devices not found.');
    }
    return devices;
  }
}
