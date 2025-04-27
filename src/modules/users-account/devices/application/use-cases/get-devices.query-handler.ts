import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ObjectId } from 'mongodb';
import { DeviceViewDto } from '../../interfaces/dto/devices.view-dto';
import { DevicesOrmQueryRepository } from '../../infrastructure/repositories/devices.orm.query-repository';

export class GetDevicesQuery {
  constructor(public userId: number) {}
}

@QueryHandler(GetDevicesQuery)
export class GetDevicesHandler implements IQueryHandler<GetDevicesQuery> {
  constructor(
    private readonly devicesQueryRepository: DevicesOrmQueryRepository,
  ) {}
  async execute(query: GetDevicesQuery): Promise<DeviceViewDto[]> {
    const devices = await this.devicesQueryRepository.getDevices(query.userId);
    return devices.map((device) => DeviceViewDto.mapToView(device));
  }
}
