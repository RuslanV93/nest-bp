import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ObjectId } from 'mongodb';
import { UsersSqlRepository } from '../../infrastructure/repositories/users.sql.repository';
import { SqlDomainUser } from '../../domain/users.sql.domain';

export class DeleteUserCommand {
  constructor(public id: ObjectId) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase implements ICommandHandler<DeleteUserCommand> {
  constructor(private readonly usersRepository: UsersSqlRepository) {}
  async execute(command: DeleteUserCommand) {
    const user: SqlDomainUser =
      await this.usersRepository.findOrNotFoundException(command.id);
    user.deleteUser();
    await this.usersRepository.deleteUser(user);
    return user;
  }
}
