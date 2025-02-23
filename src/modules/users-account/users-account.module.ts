import { Module } from '@nestjs/common';
import { UsersController } from './users/interfaces/users.controller';
import { UsersRepository } from './users/infrastructure/repositories/users.repository';
import { UsersQueryRepository } from './users/infrastructure/repositories/users.query.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users/domain/users.model';
import { CryptoService } from './auth/application/crypto.service';
import { NotificationModule } from '../notification/notification.module';
import { EmailService } from '../notification/application/email.service';
import { AuthController } from './auth/interfaces/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthQueryRepository } from './auth/infrastructure/auth.query-repository';
import { AuthService } from './auth/application/auth.service';
import { TokenService } from './auth/application/jwt.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './auth/guards/local/local.strategy';
import { JwtStrategy } from './auth/guards/bearer/jwt-strategy';
import { LoginUseCase } from './auth/application/auth-use-cases/login.use-case';
import { CreateUserUseCase } from './auth/application/users-use-cases/create-user.use-case';
import { RegistrationUseCase } from './auth/application/users-use-cases/registration.use-case';
import { DeleteUserUseCase } from './auth/application/users-use-cases/delete-user.use-case';
import { EmailResendUseCase } from './auth/application/users-use-cases/email-resend.use-case';
import { PasswordRecoveryUseCase } from './auth/application/users-use-cases/password-recovery.use-case';
import { PasswordUpdateUseCase } from './auth/application/users-use-cases/password-update.use-case';
import { RegistrationConfirmUseCase } from './auth/application/users-use-cases/registration-confirm.use-case';
import { SoftJwtStrategy } from './auth/guards/bearer/soft-jwt-strategy';

const usersUseCases = [
  RegistrationUseCase,
  RegistrationConfirmUseCase,
  CreateUserUseCase,
  DeleteUserUseCase,
  EmailResendUseCase,
  PasswordRecoveryUseCase,
  PasswordUpdateUseCase,
];

const authUseCases = [LoginUseCase];

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    NotificationModule,
  ],
  controllers: [UsersController, AuthController],
  providers: [
    ...usersUseCases,
    ...authUseCases,
    LocalStrategy,
    JwtStrategy,
    SoftJwtStrategy,
    UsersRepository,
    UsersQueryRepository,
    AuthQueryRepository,
    AuthService,
    TokenService,
    CryptoService,
    EmailService,
  ],
  exports: [UsersRepository],
})
export class UsersAccountModule {}
