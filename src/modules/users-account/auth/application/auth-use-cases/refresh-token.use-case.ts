import { UserRefreshContextDto } from '../../guards/dto/user-context.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TokenService } from '../jwt.service';

export class RefreshTokenCommand {
  constructor(public user: UserRefreshContextDto) {}
}

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenUseCase
  implements ICommandHandler<RefreshTokenCommand>
{
  constructor(private readonly tokenService: TokenService) {}
  async execute(command: RefreshTokenCommand) {
    const { id, exp } = command.user;
    const isActiveVersion = this.tokenService.validateTokenVersion(id, exp);
  }
}
