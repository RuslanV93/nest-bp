import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { UserInputDto } from '../../users/interfaces/dto/userInputDto';
import { UsersService } from '../../users/application/users.service';
import { UsersQueryRepository } from '../../users/infrastructure/repositories/users.query.repository';
import { ConfirmCodeDto, EmailResendingDto } from './dto/confirm-code.dto';
import { isSuccess } from '../../../../shared/utils/isSuccessHelpFunction';
import {
  PasswordUpdateInputDto,
  PasswordRecoveryInputDto,
} from './dto/password.dto';
import { LoginInputDto } from './dto/login.input-dto';
import { AuthService } from '../application/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginInputDto) {
    return await this.authService.login(body);
  }
  @Get('me')
  async getMe() {
    return true;
  }
  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  /** User registration endpoint */
  async registration(@Body() body: UserInputDto) {
    const createUserResult = await this.usersService.registration(body);
    const newUser = await this.usersQueryRepository.getUserById(
      createUserResult.data,
    );
    if (!newUser) {
      throw new InternalServerErrorException();
    }
    return newUser;
  }
  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationConfirm(@Body() body: ConfirmCodeDto) {
    const confirmResult = await this.usersService.confirmEmail(body);

    if (!isSuccess(confirmResult)) {
      throw new InternalServerErrorException();
    }
    return true;
  }

  @Post('registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationEmailResending(@Body() body: EmailResendingDto) {
    const emailResendResult = await this.usersService.emailResend(body);
    if (!isSuccess(emailResendResult)) {
      throw new InternalServerErrorException();
    }
    return true;
  }

  @Post('password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  async passwordRecovery(@Body() body: PasswordRecoveryInputDto) {
    const passwordRecoveryResult =
      await this.usersService.passwordRecovery(body);
    if (!isSuccess(passwordRecoveryResult)) {
      throw new InternalServerErrorException();
    }
    return true;
  }
  @Post('new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async newPassword(@Body() body: PasswordUpdateInputDto) {
    const passwordUpdateResult = await this.usersService.passwordUpdate(body);
    if (!isSuccess(passwordUpdateResult)) {
      throw new InternalServerErrorException();
    }
    return true;
  }
}
