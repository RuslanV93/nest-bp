import { UserRefreshContextDto } from '../../guards/dto/user-context.dto';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TokenService } from '../jwt.service';
import { ClientInfoDto } from '../../../devices/types/client-info.dto';
import { UnauthorizedDomainException } from '../../../../../core/exceptions/domain-exception';
import { UpdateDeviceCommand } from '../../../devices/application/use-cases/update-device.use-case';
import { DevicesSqlRepository } from '../../../devices/infrastructure/repositories/devices.sql.repository';

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
    private readonly devicesRepository: DevicesSqlRepository,
    private readonly commandBus: CommandBus,
  ) {}
  async execute(
    command: RefreshTokenCommand,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { id, exp } = command.user;
    /** getting session */

    const session = await this.devicesRepository.findSessionByTokenVersion(
      exp,
      id,
    );
    if (!session) {
      throw UnauthorizedDomainException.create('Token is expired');
    }
    /** generate new token pare */
    const { accessToken, refreshToken } = this.tokenService.generateTokens(
      id.toString(),
      session.deviceId,
    );
    /** getting token payload from new token. version exists */
    const tokenPayload = this.tokenService.getRefreshTokenPayload(refreshToken);
    await this.commandBus.execute(
      new UpdateDeviceCommand(
        session,
        command.user,
        command.clientInfo,
        tokenPayload.exp,
      ),
    );

    return { accessToken, refreshToken };
  }
}
