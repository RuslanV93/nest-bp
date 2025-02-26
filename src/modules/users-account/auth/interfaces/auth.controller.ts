import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserInputDto } from '../../users/interfaces/dto/userInputDto';
import { UsersQueryRepository } from '../../users/infrastructure/repositories/users.query.repository';
import { ConfirmCodeViewDto, EmailResendingDto } from './dto/confirm-code.dto';
import {
  PasswordUpdateInputDto,
  PasswordRecoveryInputDto,
} from './dto/password.dto';
import { AuthService } from '../application/auth.service';
import { LocalAuthGuard } from '../guards/local/local.auth.guard';
import { ExtractUserFromRequest } from '../guards/decorators/extract-user-from-request-decorator';
import {
  UserContextDto,
  UserRefreshContextDto,
} from '../guards/dto/user-context.dto';
import { JwtAuthGuard } from '../guards/bearer/jwt-auth-guard';
import { AuthQueryRepository } from '../infrastructure/auth.query-repository';
import { ResultObject } from '../../../../shared/types/serviceResultObjectType';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MeViewDto } from '../../users/interfaces/dto/userViewDto';
import { LoginInputDto } from './dto/login.input-dto';
import { LoginCommand } from '../application/auth-use-cases/login.use-case';
import { CommandBus } from '@nestjs/cqrs';
import { Tokens } from '../application/jwt.service';
import { RegistrationCommand } from '../application/users-use-cases/registration.use-case';
import { ObjectId } from 'mongodb';
import { EmailResendCommand } from '../application/users-use-cases/email-resend.use-case';
import { RegistrationConfirmCommand } from '../application/users-use-cases/registration-confirm.use-case';
import { PasswordRecoveryCommand } from '../application/users-use-cases/password-recovery.use-case';
import { PasswordUpdateCommand } from '../application/users-use-cases/password-update.use-case';
import {
  CookieInterceptor,
  LoginResponseDto,
} from '../../../../core/interceptors/refresh-cookie.interceptor';
import { RefreshTokenCommand } from '../application/auth-use-cases/refresh-token.use-case';
import { RefreshGuard } from '../guards/bearer/jwt-refresh-auth-guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly authService: AuthService,
    private readonly authQueryRepository: AuthQueryRepository,
    private readonly commandBus: CommandBus,
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
  @UseInterceptors(CookieInterceptor)
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiResponse({ type: ConfirmCodeViewDto })
  @ApiOperation({ summary: 'Login user into system.' })
  @ApiBody({ type: LoginInputDto })
  async login(@ExtractUserFromRequest() user: UserContextDto) {
    const { accessToken, refreshToken }: Tokens = await this.commandBus.execute(
      new LoginCommand(user.id),
    );
    return new LoginResponseDto(accessToken, refreshToken);
  }

  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'User registration' })
  /** User registration endpoint */
  async registration(@Body() body: UserInputDto) {
    const createUserResult: ResultObject<ObjectId> =
      await this.commandBus.execute(new RegistrationCommand(body));

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
    await this.commandBus.execute(new RegistrationConfirmCommand(body));
    return true;
  }

  @Post('registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Email confirmation code send' })
  async registrationEmailResending(@Body() body: EmailResendingDto) {
    await this.commandBus.execute(new EmailResendCommand(body));
    return true;
  }

  @Post('password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Password recovery code send' })
  async passwordRecovery(@Body() body: PasswordRecoveryInputDto) {
    await this.commandBus.execute(new PasswordRecoveryCommand(body));

    return true;
  }

  @Post('new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Set new password' })
  async newPassword(@Body() body: PasswordUpdateInputDto) {
    await this.commandBus.execute(new PasswordUpdateCommand(body));

    return true;
  }

  /** Refresh and access token sending*/
  @Post('refresh-token')
  @UseGuards(RefreshGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh token' })
  async refreshToken(@ExtractUserFromRequest() user: UserRefreshContextDto) {
    const { accessToken, refreshToken } = await this.commandBus.execute(
      new RefreshTokenCommand(user),
    );
  }
}
