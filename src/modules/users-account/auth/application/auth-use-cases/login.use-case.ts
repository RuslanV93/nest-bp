import { TokenService } from '../jwt.service';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ObjectId } from 'mongodb';
import { ClientInfoDto } from '../../../devices/types/client-info.dto';
import { CreateDeviceCommand } from '../../../devices/application/use-cases/create-device.use-case';
import { randomUUID } from 'node:crypto';

export class LoginCommand {
  constructor(
    public userId: ObjectId,
    public clientInfo: ClientInfoDto,
  ) {}
}
@CommandHandler(LoginCommand)
export class LoginUseCase implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly tokenService: TokenService,
    private readonly commandBus: CommandBus,
  ) {}
  async execute(command: LoginCommand) {
    const deviceId: string = randomUUID();
    const { accessToken, refreshToken } = this.tokenService.generateTokens(
      command.userId.toString(),
      deviceId,
    );

    const refreshTokenPayload =
      this.tokenService.getRefreshTokenPayload(refreshToken);

    await this.commandBus.execute(
      new CreateDeviceCommand(
        command.userId,
        command.clientInfo,
        refreshTokenPayload.exp,
        refreshTokenPayload.deviceId,
      ),
    );
    return { accessToken, refreshToken };
  }
}
