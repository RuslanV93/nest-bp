import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionsRepository } from '../../infrastructure/repositories/questions.repository';

export class UpdateQuestionPublishCommand {
  constructor(
    public id: number,
    public published: boolean,
  ) {}
}

@CommandHandler(UpdateQuestionPublishCommand)
export class UpdateQuestionPublishUseCase
  implements ICommandHandler<UpdateQuestionPublishCommand>
{
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async execute(command: UpdateQuestionPublishCommand) {
    const question = await this.questionsRepository.findOneOrNotFoundException(
      command.id,
    );
    question.publishQuestion(command.published);
    await this.questionsRepository.save(question);
  }
}
