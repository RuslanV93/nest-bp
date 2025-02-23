import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../users/infrastructure/repositories/users.repository';
import { ObjectId } from 'mongodb';

export class DeleteUserCommand {
  constructor(public id: ObjectId) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase implements ICommandHandler<DeleteUserCommand> {
  constructor(private readonly usersRepository: UsersRepository) {}
  async execute(command: DeleteUserCommand) {
    const user = await this.usersRepository.findOrNotFoundException(command.id);
    user.deleteUser();
    await this.usersRepository.save(user);
    return user;
  }
}
