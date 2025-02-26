import { TokenService } from '../jwt.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ObjectId } from 'mongodb';

export class LoginCommand {
  constructor(public userId: ObjectId) {}
}
@CommandHandler(LoginCommand)
export class LoginUseCase implements ICommandHandler<LoginCommand> {
  constructor(private readonly tokenService: TokenService) {}
  async execute(command: LoginCommand) {
    const { accessToken, refreshToken } = this.tokenService.generateTokens(
      command.userId.toString(),
    );
    return { accessToken, refreshToken };
  }
}
