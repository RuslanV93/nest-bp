import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBasicAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { QuestionsQueryRepository } from '../infrastructure/repositories/questions.query-repository';
import { GetQuestionsQueryParams } from './dto/get-questions.query-params.input.dto';
import {
  ApiPaginatedResponse,
  ApiPaginationQueries,
} from '../../../../../swagger/swagger.decorator';
import { QuestionViewDto } from './dto/question.view-dto';
import { QuestionInputDto, QuestionPublishDto } from './dto/question.input.dto';
import { BasicAuthGuard } from '../../../users-account/auth/guards/basic/basic-strategy';
import { CommandBus } from '@nestjs/cqrs';
import { CreateQuestionCommand } from '../application/use-cases/create-question.use-case';
import { DeleteQuestionCommand } from '../application/use-cases/delete-question.use-case';
import { UpdateQuestionCommand } from '../application/use-cases/update-question.use-case';
import { UpdateQuestionPublishCommand } from '../application/use-cases/update-question-publish.use-case';

@Controller('sa/quiz/questions')
@ApiBasicAuth()
export class QuestionController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly questionsQueryRepository: QuestionsQueryRepository,
  ) {}

  /** Getting all questions. Using a query, search params.*/
  @Get()
  @ApiBasicAuth('basicAuth')
  @UseGuards(BasicAuthGuard)
  @ApiPaginatedResponse(QuestionViewDto)
  @ApiPaginationQueries('questions')
  @ApiOperation({ summary: 'Get all questions' })
  async getQuestions(@Query() query: GetQuestionsQueryParams) {
    const questions = await this.questionsQueryRepository.getQuestions(query);
    if (!questions) {
      throw new InternalServerErrorException('Questions not found');
    }
    return questions;
  }

  /** Create new question */

  @Post()
  @UseGuards(BasicAuthGuard)
  @ApiBody({ type: QuestionInputDto })
  @ApiOperation({ summary: 'Add new question' })
  @HttpCode(HttpStatus.CREATED)
  async createNewQuestion(@Body() body: QuestionInputDto) {
    const newQuestionId: number = await this.commandBus.execute(
      new CreateQuestionCommand(body),
    );
    const newQuestion =
      await this.questionsQueryRepository.getQuestionById(newQuestionId);
    if (!newQuestion) {
      throw new InternalServerErrorException('Something went wrong');
    }
    return newQuestion;
  }

  @Delete(':id')
  @UseGuards(BasicAuthGuard)
  @ApiOperation({ summary: 'Delete question' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteQuestion(@Param('id', ParseIntPipe) id: number) {
    await this.commandBus.execute(new DeleteQuestionCommand(id));
  }

  @Put(':id')
  @UseGuards(BasicAuthGuard)
  @ApiBody({ type: QuestionInputDto })
  @ApiOperation({ summary: 'Update question' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateQuestion(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: QuestionInputDto,
  ) {
    await this.commandBus.execute(new UpdateQuestionCommand(id, body));
  }

  @Put(':id/publish')
  @UseGuards(BasicAuthGuard)
  @ApiBody({ type: QuestionPublishDto })
  @ApiOperation({ summary: 'Publish question' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async publishQuestion(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: QuestionPublishDto,
  ) {
    await this.commandBus.execute(
      new UpdateQuestionPublishCommand(id, body.published),
    );
  }
}
