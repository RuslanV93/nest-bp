import { QuestionInputDto } from '../../interfaces/dto/question.input.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionsRepository } from '../../infrastructure/repositories/questions.repository';

export class UpdateQuestionCommand {
  constructor(
    public id: number,
    public questionDto: QuestionInputDto,
  ) {}
}

@CommandHandler(UpdateQuestionCommand)
export class UpdateQuestionUseCase
  implements ICommandHandler<UpdateQuestionCommand>
{
  constructor(private readonly questionRepository: QuestionsRepository) {}
  async execute(command: UpdateQuestionCommand) {
    const question = await this.questionRepository.findOneOrNotFoundException(
      command.id,
    );
    question.updateQuestion(command.questionDto);
    await this.questionRepository.save(question);
  }
}
