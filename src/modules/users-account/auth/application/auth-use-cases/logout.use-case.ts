import { UserRefreshContextDto } from '../../guards/dto/user-context.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DevicesRepository } from '../../../devices/infrastructure/repositories/devices.repository';
import { UnauthorizedDomainException } from '../../../../../core/exceptions/domain-exception';

export class LogoutCommand {
  constructor(public user: UserRefreshContextDto) {}
}

@CommandHandler(LogoutCommand)
export class LogoutUseCase implements ICommandHandler<LogoutCommand> {
  constructor(private readonly devicesRepository: DevicesRepository) {}
  async execute(command: LogoutCommand) {
    const session = await this.devicesRepository.findSessionByTokenVersion(
      command.user.exp,
      command.user.id,
    );
    if (!session) {
      throw UnauthorizedDomainException.create('Unauthorized here');
    }
    session.deleteDevice();
    await this.devicesRepository.save(session);
  }
}
