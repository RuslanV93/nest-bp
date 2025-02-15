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

@Module({
  imports: [
    JwtModule.register({
      secret: 'accessToken',
      signOptions: { expiresIn: '5m' },
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    NotificationModule,
  ],
  controllers: [UsersController, AuthController],
  providers: [
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    CryptoService,
    EmailService,
  ],
})
export class UsersAccountModule {}
