import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserInputDto } from '../../../users/interfaces/dto/userInputDto';
import { BadRequestDomainException } from '../../../../../core/exceptions/domain-exception';
import { DomainUser } from '../../../users/domain/users.domain';
import {
  User,
  UserDocument,
  UserModelType,
} from '../../../users/domain/users.model';
import { ObjectId } from 'mongodb';
import { ServiceResultObjectFactory } from '../../../../../shared/utils/serviceResultObject';
import { UsersRepository } from '../../../users/infrastructure/repositories/users.repository';
import { CryptoService } from '../crypto.service';
import { InjectModel } from '@nestjs/mongoose';
import { ResultObject } from '../../../../../shared/types/serviceResultObjectType';

export class CreateUserCommand {
  constructor(public userDto: UserInputDto) {}
}
@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly cryptoService: CryptoService,
    @InjectModel(User.name) private UserModel: UserModelType,
  ) {}
  async execute(command: CreateUserCommand): Promise<ResultObject<ObjectId>> {
    const userWithTheSameLoginOrEmail =
      await this.usersRepository.findExistingUserByLoginOrEmail(
        command.userDto.login,
        command.userDto.email,
      );
    if (userWithTheSameLoginOrEmail) {
      throw BadRequestDomainException.create(
        'User login or email already taken',
        userWithTheSameLoginOrEmail.field,
      );
    }
    const passwordHash = await this.cryptoService.createPasswordHash(
      command.userDto.password,
    );

    const userEntity = DomainUser.create(
      command.userDto.login,
      command.userDto.email,
      passwordHash,
    );
    const user: UserDocument = this.UserModel.createInstance(
      userEntity.toSchema(),
    );
    const newUserId: ObjectId = await this.usersRepository.save(user);

    return ServiceResultObjectFactory.successResultObject(newUserId);
  }
}
