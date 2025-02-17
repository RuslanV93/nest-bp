import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserInputDto } from '../../users/interfaces/dto/userInputDto';
import { UsersService } from '../../users/application/users.service';
import { UsersQueryRepository } from '../../users/infrastructure/repositories/users.query.repository';
import { ConfirmCodeViewDto, EmailResendingDto } from './dto/confirm-code.dto';
import { isSuccess } from '../../../../shared/utils/isSuccessHelpFunction';
import {
  PasswordUpdateInputDto,
  PasswordRecoveryInputDto,
} from './dto/password.dto';
import { AuthService } from '../application/auth.service';
import { LocalAuthGuard } from '../guards/local/local.auth.guard';
import { ExtractUserFromRequest } from '../guards/decorators/extract-user-from-request-decorator';
import { UserContextDto } from '../guards/dto/user-context.dto';
import { JwtAuthGuard } from '../guards/bearer/jwt-auth-guard';
import { AuthQueryRepository } from '../infrastructure/auth.query-repository';
import { DomainStatusCode } from '../../../../shared/types/serviceResultObjectType';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MeViewDto } from '../../users/interfaces/dto/userViewDto';
import { LoginInputDto } from './dto/login.input-dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly authService: AuthService,
    private readonly authQueryRepository: AuthQueryRepository,
  ) {}

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: HttpStatus.OK, type: MeViewDto })
  @ApiOperation({ summary: 'Get info about current user' })
  async getMe(@ExtractUserFromRequest() user: UserContextDto) {
    return this.authQueryRepository.getMe(user.id);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiResponse({ type: ConfirmCodeViewDto })
  @ApiOperation({ summary: 'Login user into system.' })
  @ApiBody({ type: LoginInputDto })
  login(@ExtractUserFromRequest() user: UserContextDto) {
    const { accessToken } = this.authService.login(user.id);
    return { accessToken: accessToken };
  }

  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'User registration' })
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
  @ApiOperation({ summary: 'Confirm registration' })
  async registrationConfirm(@Body() body: ConfirmCodeViewDto) {
    const confirmResult = await this.usersService.confirmEmail(body);

    if (!isSuccess(confirmResult)) {
      throw new InternalServerErrorException();
    }
    return true;
  }

  @Post('registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Email confirmation code send' })
  async registrationEmailResending(@Body() body: EmailResendingDto) {
    const emailResendResult = await this.usersService.emailResend(body);
    if (emailResendResult.status !== DomainStatusCode.Success) {
      throw new InternalServerErrorException();
    }
    return true;
  }

  @Post('password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Password recovery code send' })
  async passwordRecovery(@Body() body: PasswordRecoveryInputDto) {
    const passwordRecoveryResult =
      await this.usersService.passwordRecovery(body);
    if (passwordRecoveryResult.status !== DomainStatusCode.Success) {
      throw new InternalServerErrorException();
    }
    return true;
  }
  @Post('new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Set new password' })
  async newPassword(@Body() body: PasswordUpdateInputDto) {
    const passwordUpdateResult = await this.usersService.passwordUpdate(body);
    if (passwordUpdateResult.status !== DomainStatusCode.Success) {
      throw new InternalServerErrorException();
    }
    return true;
  }
}
