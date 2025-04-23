import {
  Controller,
  Get,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { ApiBasicAuth, ApiOperation } from '@nestjs/swagger';
import { QuestionsQueryRepository } from '../infrastructure/repositories/questions.query-repository';
import { GetQuestionsQueryParams } from './dto/get-questions.query-params.input.dto';

@Controller('sa/quiz/questions')
export class QuestionController {
  constructor(
    private readonly questionsQueryRepository: QuestionsQueryRepository,
  ) {}
  @Get()
  @ApiBasicAuth('basicAuth')
  @ApiOperation({ summary: 'Get all questions' })
  async getQuestions(@Query() query: GetQuestionsQueryParams) {
    const questions = await this.questionsQueryRepository.getQuestions(query);
    if (!questions) {
      throw new InternalServerErrorException('Questions not found');
    }
    return questions;
  }
}
