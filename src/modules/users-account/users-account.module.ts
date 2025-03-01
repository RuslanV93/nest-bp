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
import { CreateUserUseCase } from './users/application/users-use-cases/create-user.use-case';
import { RegistrationUseCase } from './users/application/users-use-cases/registration.use-case';
import { DeleteUserUseCase } from './users/application/users-use-cases/delete-user.use-case';
import { EmailResendUseCase } from './users/application/users-use-cases/email-resend.use-case';
import { PasswordRecoveryUseCase } from './users/application/users-use-cases/password-recovery.use-case';
import { PasswordUpdateUseCase } from './users/application/users-use-cases/password-update.use-case';
import { RegistrationConfirmUseCase } from './users/application/users-use-cases/registration-confirm.use-case';
import { SoftJwtStrategy } from './auth/guards/bearer/soft-jwt-strategy';
import { JwtRefreshStrategy } from './auth/guards/bearer/jwt-refresh-strategy';
import { RefreshTokenUseCase } from './auth/application/auth-use-cases/refresh-token.use-case';
import { CreateDeviceUseCase } from './devices/application/use-cases/create-device.use-case';
import {
  DeleteOtherDevicesUseCase,
  DeleteSpecifiedDeviceUseCase,
} from './devices/application/use-cases/delete-device.use-case';
import { DevicesRepository } from './devices/infrastructure/repositories/devices.repository';
import { DevicesQueryRepository } from './devices/infrastructure/repositories/devices.query-repository';
import { Device, DeviceSchema } from './devices/domain/devices.model';
import { DevicesController } from './devices/interfaces/devices.controller';
import { GetDevicesHandler } from './devices/application/use-cases/get-devices.query-handler';
import { DevicesService } from './devices/application/devices.service';

const usersUseCases = [
  RegistrationUseCase,
  RegistrationConfirmUseCase,
  CreateUserUseCase,
  DeleteUserUseCase,
  EmailResendUseCase,
  PasswordRecoveryUseCase,
  PasswordUpdateUseCase,
];

const authUseCases = [
  LoginUseCase,
  RefreshTokenUseCase,
  CreateDeviceUseCase,
  DeleteSpecifiedDeviceUseCase,
  DeleteOtherDevicesUseCase,
  GetDevicesHandler,
];

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }]),
    NotificationModule,
  ],
  controllers: [UsersController, AuthController, DevicesController],
  providers: [
    ...usersUseCases,
    ...authUseCases,
    LocalStrategy,
    JwtStrategy,
    SoftJwtStrategy,
    JwtRefreshStrategy,
    UsersRepository,
    UsersQueryRepository,
    AuthQueryRepository,
    AuthService,
    TokenService,
    CryptoService,
    EmailService,
    DevicesRepository,
    DevicesQueryRepository,
  ],
  exports: [UsersRepository],
})
export class UsersAccountModule {}
