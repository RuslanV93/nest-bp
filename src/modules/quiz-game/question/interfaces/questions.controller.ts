import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
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
import { QuestionInputDto } from './dto/question.input.dto';
import { BasicAuthGuard } from '../../../users-account/auth/guards/basic/basic-strategy';
import { CommandBus } from '@nestjs/cqrs';
import { CreateQuestionCommand } from '../application/use-cases/create-question.use-case';

@Controller('sa/quiz/questions')
export class QuestionController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly questionsQueryRepository: QuestionsQueryRepository,
  ) {}

  /** Getting all questions. Using query, search params.*/
  @Get()
  @ApiBasicAuth('basicAuth')
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
}
