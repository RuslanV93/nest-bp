import { UserRefreshContextDto } from '../../guards/dto/user-context.dto';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TokenService } from '../jwt.service';
import { DevicesRepository } from '../../../devices/infrastructure/repositories/devices.repository';
import { ClientInfoDto } from '../../../devices/types/client-info.dto';
import { UnauthorizedDomainException } from '../../../../../core/exceptions/domain-exception';
import { DeviceDomainDto } from '../../../devices/domain/dto/device.domain-dto';

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

    const title = `Device: ${command.clientInfo.device || 'other'},
     Platform: ${command.clientInfo.os || 'other'}, Browser: ${command.clientInfo.browser || 'other'}`;
    const updateDto: DeviceDomainDto = {
      userId: command.user.id,
      ip: command.clientInfo.ip,
      title: title,
      tokenVersion: tokenPayload.exp,
      deviceId: command.user.deviceId,
    };

    session.updateSession(updateDto);
    await this.devicesRepository.save(session);

    return { accessToken, refreshToken };
  }
}
