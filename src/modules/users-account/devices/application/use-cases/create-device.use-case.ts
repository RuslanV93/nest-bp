import { ICommandHandler } from '@nestjs/cqrs';

export class CreateDeviceCommand {
  constructor() {}
}
export class CreateDeviceUseCase
  implements ICommandHandler<CreateDeviceCommand>
{
  constructor() {}
  execute(command: CreateDeviceCommand): Promise<void> {}
}
