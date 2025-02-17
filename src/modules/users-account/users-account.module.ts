import { Module } from '@nestjs/common';
import { UsersService } from './users/application/users.service';
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
import { LocalAuthGuard } from './auth/guards/local/local.auth.guard';
import { JwtStrategy } from './auth/guards/bearer/jwt-strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'accessToken',
      signOptions: { expiresIn: '5m' },
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    NotificationModule,
  ],
  controllers: [UsersController, AuthController],
  providers: [
    LocalStrategy,
    JwtStrategy,
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    AuthQueryRepository,
    AuthService,
    TokenService,
    CryptoService,
    EmailService,
  ],
})
export class UsersAccountModule {}
