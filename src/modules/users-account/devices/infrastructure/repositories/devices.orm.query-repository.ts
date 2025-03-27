import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Device } from '../../domain/devices.orm.domain';
import { Repository } from 'typeorm';

@Injectable()
export class DevicesOrmQueryRepository {
  constructor(
    @InjectRepository(Device)
    private readonly devicesQueryRepository: Repository<Device>,
  ) {}
}
