import { UserRefreshContextDto } from '../../guards/dto/user-context.dto';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TokenService } from '../jwt.service';
import { ClientInfoDto } from '../../../devices/types/client-info.dto';
import { UnauthorizedDomainException } from '../../../../../core/exceptions/domain-exception';
import { UpdateDeviceCommand } from '../../../devices/application/use-cases/update-device.use-case';
import { DevicesOrmRepository } from '../../../devices/infrastructure/repositories/devices.orm.repository';
import { Device } from '../../../devices/domain/devices.orm.domain';

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
    private readonly devicesRepository: DevicesOrmRepository,
    private readonly commandBus: CommandBus,
  ) {}
  async execute(
    command: RefreshTokenCommand,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { id, exp, deviceId } = command.user;
    /** getting session */
    const session: Device | null =
      await this.devicesRepository.findSessionByDeviceIdAndUserId(deviceId, id);

    if (!session || session.tokenVersion !== exp.toString()) {
      throw UnauthorizedDomainException.create('Token is expired');
    }
    /** generate new token pare */
    const { accessToken, refreshToken } = this.tokenService.generateTokens(
      id,
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
