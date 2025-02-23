import { TokenService } from '../jwt.service';
import { CommandHandler } from '@nestjs/cqrs';
import { ObjectId } from 'mongodb';

export class LoginCommand {
  constructor(public userId: ObjectId) {}
}
@CommandHandler(LoginCommand)
export class LoginUseCase {
  constructor(private readonly tokenService: TokenService) {}
  execute(command: LoginCommand) {
    const { accessToken, refreshToken } = this.tokenService.generateTokens(
      command.userId.toString(),
    );
    return { accessToken, refreshToken };
  }
}
