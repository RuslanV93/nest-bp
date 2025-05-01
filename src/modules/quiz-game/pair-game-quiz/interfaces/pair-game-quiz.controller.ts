import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserContextDto } from '../../../users-account/auth/guards/dto/user-context.dto';
import { ExtractUserFromRequest } from '../../../users-account/auth/guards/decorators/extract-user-from-request-decorator';
import { JwtAuthGuard } from '../../../users-account/auth/guards/bearer/jwt-auth-guard';
import { ApiOperation } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { ConnectionCommand } from '../application/connection.use-case';
import { Game } from '../domain/game.orm.domain';

@Controller('pair-game-quiz/pairs')
export class PairGameQuizController {
  constructor(private readonly commandBus: CommandBus) {}
  @Get('my-current')
  async getMyCurrentGame() {
    return 'hello';
  }

  @Get(':id')
  async getGameById(@Param('id', ParseIntPipe) id: number) {}

  @Post('connection')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create new game or connect to existing game' })
  async connection(@ExtractUserFromRequest() user: UserContextDto) {
    const game: Game = await this.commandBus.execute(
      new ConnectionCommand(user.id),
    );
    if (!game) {
      return 'from controller';
    }

    return game.id;
  }

  @Post('my-current/answer')
  async answer() {}
}
