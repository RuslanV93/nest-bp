import { UserRefreshContextDto } from '../../guards/dto/user-context.dto';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TokenService } from '../jwt.service';
import { DevicesRepository } from '../../../devices/infrastructure/repositories/devices.repository';
import { ClientInfoDto } from '../../../devices/types/client-info.dto';
import { UpdateDeviceCommand } from '../../../devices/application/use-cases/update-device.use-case';

export class RefreshTokenCommand {
  constructor(
    public user: UserRefreshContextDto,
    public clientInfo: ClientInfoDto,
  ) {}
}

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenUseCase
  implements ICommandHandler<RefreshTokenCommand>
{
  constructor(
    private readonly tokenService: TokenService,
    private readonly devicesRepository: DevicesRepository,
    private readonly commandBus: CommandBus,
  ) {}
  async execute(command: RefreshTokenCommand) {
    const { id, exp } = command.user;
    /** getting session */
    const session = await this.devicesRepository.findSessionByTokenVersion(
      exp,
      id,
    );
    /** generate new token pare */
    const { accessToken, refreshToken } = this.tokenService.generateTokens(
      id.toString(),
      session.deviceId,
    );
    /** getting token payload from new token. version exists */
    const tokenPayload = this.tokenService.getRefreshTokenPayload(refreshToken);

    /** update device session info */
    const deviceUpdateDto = {
      version: tokenPayload.exp,
      userId: id,
      clientInfo: command.clientInfo,
      deviceId: tokenPayload.deviceId,
    };
    const updatedDevice = await this.commandBus.execute(
      new UpdateDeviceCommand(deviceUpdateDto),
    );
  }
}
