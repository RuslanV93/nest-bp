import { TokenService } from '../jwt.service';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ObjectId } from 'mongodb';
import { ClientInfoDto } from '../../../devices/types/client-info.dto';
import { CreateDeviceCommand } from '../../../devices/application/use-cases/create-device.use-case';

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
    const { accessToken, refreshToken } = this.tokenService.generateTokens(
      command.userId.toString(),
    );

    const tokenVersion: string =
      this.tokenService.getRefreshTokenVersion(refreshToken);

    await this.commandBus.execute(
      new CreateDeviceCommand(command.userId, command.clientInfo, tokenVersion),
    );
    return { accessToken, refreshToken };
  }
}
