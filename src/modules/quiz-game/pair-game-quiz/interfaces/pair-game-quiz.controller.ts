import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserContextDto } from '../../../users-account/auth/guards/dto/user-context.dto';
import { ExtractUserFromRequest } from '../../../users-account/auth/guards/decorators/extract-user-from-request-decorator';
import { JwtAuthGuard } from '../../../users-account/auth/guards/bearer/jwt-auth-guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ConnectionCommand } from '../application/connection.use-case';
import { Game } from '../domain/game.orm.domain';
import { GameAnswer } from '../domain/answer.orm.domain';
import { AnswerCommand } from '../application/answer.use-case';
import { AnswerInputDto } from './dto/answer.input-dto';
import { GetCurrentGameQuery } from '../application/current-game.query-handler';
import { GameViewDto } from './dto/game.view-dto';
import { GetGameByIdQuery } from '../application/game-by-id.query-handler';
import { GameAnswerQuery } from '../application/game-answer.query-handler';
import { AnswerViewDto } from './dto/answer.view-dto';
import { ApiPaginatedResponse } from '../../../../../swagger/swagger.decorator';
import { StatisticsViewDto } from './dto/statistics.view-dto';
import { GetStatisticQuery } from '../application/statistic.query-handler';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { GetGamesQueryParams } from './dto/get-games.query-params';
import { GetMyGamesQuery } from '../application/my-games.query-handler';
import { GetStatisticsQueryParams } from './dto/get-statistic.query-params';
import { GetPlayersTopQuery } from '../application/get-top.query-handler';
@ApiBearerAuth()
@Controller('pair-game-quiz')
export class PairGameQuizController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  /** Get the current game by token */
  @Get('pairs/my-current')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get the current game' })
  @ApiPaginatedResponse(GameViewDto)
  async getMyCurrentGame(
    @ExtractUserFromRequest() user: UserContextDto,
  ): Promise<GameViewDto> {
    return this.queryBus.execute(new GetCurrentGameQuery(user.id));
  }
  @Get('pairs/my')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all games for current user' })
  @ApiPaginatedResponse(PaginatedViewDto<GameViewDto>)
  async getMyGames(
    @ExtractUserFromRequest() user: UserContextDto,
    @Query() query: GetGamesQueryParams,
  ): Promise<PaginatedViewDto<GameViewDto>> {
    return this.queryBus.execute(new GetMyGamesQuery(user.id, query));
  }

  /** Get existing game by id */
  @Get('pairs/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get the game by id' })
  @ApiPaginatedResponse(GameViewDto)
  async getGameById(
    @Param('id', ParseIntPipe) id: number,
    @ExtractUserFromRequest() user: UserContextDto,
  ): Promise<GameViewDto> {
    return this.queryBus.execute(new GetGameByIdQuery(id, user.id));
  }

  /** Connect to existing game or create new if not exists */
  @Post('pairs/connection')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiPaginatedResponse(GameViewDto)
  @ApiOperation({ summary: 'Create new game or connect to existing game' })
  async connection(
    @ExtractUserFromRequest() user: UserContextDto,
  ): Promise<GameViewDto> {
    const game: Game = await this.commandBus.execute(
      new ConnectionCommand(user.id),
    );

    return this.queryBus.execute(new GetGameByIdQuery(game.id, user.id));
  }

  /** Answer the question */
  @Post('pairs/my-current/answers')
  @ApiPaginatedResponse(GameViewDto)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Answer the question' })
  async answer(
    @ExtractUserFromRequest() user: UserContextDto,
    @Body() body: AnswerInputDto,
  ): Promise<AnswerViewDto> {
    const newAnswer: GameAnswer = await this.commandBus.execute(
      new AnswerCommand(body.answer, user.id),
    );
    return this.queryBus.execute(new GameAnswerQuery(newAnswer.id));
  }

  @Get('users/my-statistic')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get the user statistic' })
  @ApiPaginatedResponse(StatisticsViewDto)
  async getUserStatistic(
    @ExtractUserFromRequest() user: UserContextDto,
  ): Promise<StatisticsViewDto> {
    return this.queryBus.execute(new GetStatisticQuery(user.id));
  }

  @Get('users/top')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get the top' })
  @ApiPaginatedResponse(PaginatedViewDto<GameViewDto[]>)
  async getPlayersTop(@Query() query: GetStatisticsQueryParams): Promise<any> {
    try {
      return this.queryBus.execute(new GetPlayersTopQuery(query));
    } catch (e) {
      console.log(e);
    }
  }
}
