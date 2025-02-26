import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class GetDevicesQuery {
  constructor(public something: string) {}
}

@QueryHandler(GetDevicesQuery)
export class GetDevicesHandler implements IQueryHandler<GetDevicesQuery> {
  constructor() {}
  async execute(): Promise<void> {}
}
