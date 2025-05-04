import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserContextDto } from '../../../users-account/auth/guards/dto/user-context.dto';
import { ExtractUserFromRequest } from '../../../users-account/auth/guards/decorators/extract-user-from-request-decorator';
import { JwtAuthGuard } from '../../../users-account/auth/guards/bearer/jwt-auth-guard';
import { ApiOperation } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ConnectionCommand } from '../application/connection.use-case';
import { Game } from '../domain/game.orm.domain';
import { GameAnswer } from '../domain/answer.orm.domain';
import { AnswerCommand } from '../application/answer.use-case';
import { AnswerInputDto } from './dto/answer.input-dto';
import {
  GetCurrentGameHandler,
  GetCurrentGameQuery,
} from '../application/current-game.query-handler';
import { use } from 'passport';

@Controller('pair-game-quiz/pairs')
export class PairGameQuizController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  @Get('my-current')
  async getMyCurrentGame(@ExtractUserFromRequest() user: UserContextDto) {
    const currentGame = await this.queryBus.execute(
      new GetCurrentGameQuery(user.id),
    );
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
  async answer(
    @ExtractUserFromRequest() user: UserContextDto,
    @Body() body: AnswerInputDto,
  ) {
    const newAnswer: GameAnswer = await this.commandBus.execute(
      new AnswerCommand(body.answer, user.id),
    );
    if (!newAnswer) {
      return 'from controller';
    }
    return newAnswer.id;
  }
}
