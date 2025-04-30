import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';

@Controller('pair-game-quiz/pairs')
export class PairGameQuizController {
  @Get('my-current')
  async getMyCurrentGame() {}

  @Get(':id')
  async getGameById(@Param('id', ParseIntPipe) id: number) {}

  @Post('connection')
  async connection() {}

  @Post('my-current/answer')
  async answer() {}
}
