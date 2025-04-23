import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionsRepository } from '../../infrastructure/repositories/questions.repository';

export class DeleteQuestionCommand {
  constructor(public questionId: number) {}
}
@CommandHandler(DeleteQuestionCommand)
export class DeleteQuestionUseCase
  implements ICommandHandler<DeleteQuestionCommand>
{
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async execute(command: DeleteQuestionCommand) {
    const question = await this.questionsRepository.findOneOrNotFoundException(
      command.questionId,
    );
    await this.questionsRepository.deleteQuestion(question);
  }
}
