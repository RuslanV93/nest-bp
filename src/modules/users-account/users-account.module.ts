import { Module } from '@nestjs/common';
import { UsersController } from './users/interfaces/users.controller';
import { CryptoService } from './auth/application/crypto.service';
import { NotificationModule } from '../notification/notification.module';
import { EmailService } from '../notification/application/email.service';
import { AuthController } from './auth/interfaces/auth.controller';
import { JwtModule } from '@nestjs/jwt';
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
import {
  Device as DeviceMongo,
  DeviceSchema,
} from './devices/domain/devices.model';
import { DevicesController } from './devices/interfaces/devices.controller';
import { GetDevicesHandler } from './devices/application/use-cases/get-devices.query-handler';
import { LogoutUseCase } from './auth/application/auth-use-cases/logout.use-case';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { UpdateDeviceUseCase } from './devices/application/use-cases/update-device.use-case';
import { CoreConfig } from '../../core/core-config/core.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/domain/users.orm.domain';
import { EmailInfo } from './users/domain/email-info.orm.domain';
import { PasswordInfo } from './users/domain/password-info.orm.domain';
import { UsersOrmRepository } from './users/infrastructure/repositories/users.orm.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, User as UserMongoose } from './users/domain/users.model';
import { UsersOrmQueryRepository } from './users/infrastructure/repositories/users.orm.query.repository';
import { Device } from './devices/domain/devices.orm.domain';
import { DevicesOrmQueryRepository } from './devices/infrastructure/repositories/devices.orm.query-repository';
import { DevicesOrmRepository } from './devices/infrastructure/repositories/devices.orm.repository';
import { AuthOrmQueryRepository } from './auth/infrastructure/auth.orm.query-repository';

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
  UpdateDeviceUseCase,
  CreateDeviceUseCase,
  DeleteSpecifiedDeviceUseCase,
  DeleteOtherDevicesUseCase,
  GetDevicesHandler,
  LogoutUseCase,
];

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    MongooseModule.forFeature([
      { name: UserMongoose.name, schema: UserSchema },
    ]),
    MongooseModule.forFeature([
      { name: DeviceMongo.name, schema: DeviceSchema },
    ]),
    TypeOrmModule.forFeature([User, EmailInfo, PasswordInfo, Device]),
    NotificationModule,
  ],
  controllers: [UsersController, AuthController, DevicesController],
  providers: [
    CoreConfig,

    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    ...usersUseCases,
    ...authUseCases,
    LocalStrategy,
    JwtStrategy,
    SoftJwtStrategy,
    JwtRefreshStrategy,
    {
      provide: JwtRefreshStrategy,
      useFactory: (coreConfig: CoreConfig, tokenService: TokenService) => {
        return new JwtRefreshStrategy(tokenService, coreConfig);
      },
      inject: [CoreConfig, TokenService],
    },
    UsersOrmRepository,
    UsersOrmQueryRepository,
    DevicesOrmQueryRepository,
    DevicesOrmRepository,
    AuthOrmQueryRepository,
    AuthService,
    TokenService,
    CryptoService,
    EmailService,
  ],
  exports: [UsersOrmRepository],
})
export class UsersAccountModule {}
