import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ObjectId } from 'mongodb';
import { DevicesQueryRepository } from '../../infrastructure/repositories/devices.query-repository';
import { DeviceViewDto } from '../../interfaces/dto/devices.view-dto';

export class GetDevicesQuery {
  constructor(public userId: ObjectId) {}
}

@QueryHandler(GetDevicesQuery)
export class GetDevicesHandler implements IQueryHandler<GetDevicesQuery> {
  constructor(
    private readonly devicesQueryRepository: DevicesQueryRepository,
  ) {}
  async execute(query: GetDevicesQuery): Promise<DeviceViewDto[]> {
    const devices = await this.devicesQueryRepository.getDevices(query.userId);
    return devices.map((device) => DeviceViewDto.mapToView(device));
  }
}
