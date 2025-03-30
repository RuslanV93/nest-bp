import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ObjectId } from 'mongodb';
import { UsersOrmRepository } from '../../infrastructure/repositories/users.orm.repository';
import { User } from '../../domain/users.orm.domain';

export class DeleteUserCommand {
  constructor(public id: ObjectId) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase implements ICommandHandler<DeleteUserCommand> {
  constructor(private readonly usersRepository: UsersOrmRepository) {}
  async execute(command: DeleteUserCommand) {
    const user: User = await this.usersRepository.findOrNotFoundException(
      command.id,
    );
    await this.usersRepository.deleteUser(user);
    return user;
  }
}
