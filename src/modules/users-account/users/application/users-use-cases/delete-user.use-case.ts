import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ObjectId } from 'mongodb';
import { UsersSqlRepository } from '../../infrastructure/repositories/users.sql.repository';

export class DeleteUserCommand {
  constructor(public id: ObjectId) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase implements ICommandHandler<DeleteUserCommand> {
  constructor(private readonly usersRepository: UsersSqlRepository) {}
  async execute(command: DeleteUserCommand) {
    const user = await this.usersRepository.findOrNotFoundException(command.id);
    user.deletedAt = new Date();
    await this.usersRepository.deleteUser(user);
    return user;
  }
}
