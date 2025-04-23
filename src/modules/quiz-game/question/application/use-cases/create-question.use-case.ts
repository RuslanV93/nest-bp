import { QuestionInputDto } from '../../interfaces/dto/question.input.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Question } from '../../domain/question.orm.domain';
import { QuestionsRepository } from '../../infrastructure/repositories/questions.repository';
import { InternalServerErrorException } from '@nestjs/common';

export class CreateQuestionCommand {
  constructor(public questionDto: QuestionInputDto) {}
}

@CommandHandler(CreateQuestionCommand)
export class CreateQuestionUseCase
  implements ICommandHandler<CreateQuestionCommand>
{
  constructor(private readonly questionRepository: QuestionsRepository) {}
  async execute(command: CreateQuestionCommand) {
    const question = Question.createInstance(command.questionDto);
    const newQuestionId: number =
      await this.questionRepository.createQuestion(question);
    if (!newQuestionId) {
      throw new InternalServerErrorException();
    }
    return newQuestionId;
  }
}
