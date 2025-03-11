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
import { ConfirmCodeViewDto, EmailResendingDto } from './dto/confirm-code.dto';
import {
  PasswordUpdateInputDto,
  PasswordRecoveryInputDto,
} from './dto/password.dto';
import { LocalAuthGuard } from '../guards/local/local.auth.guard';
import { ExtractUserFromRequest } from '../guards/decorators/extract-user-from-request-decorator';
import {
  UserContextDto,
  UserRefreshContextDto,
} from '../guards/dto/user-context.dto';
import { JwtAuthGuard } from '../guards/bearer/jwt-auth-guard';
import { ResultObject } from '../../../../shared/types/serviceResultObjectType';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MeViewDto } from '../../users/interfaces/dto/userViewDto';
import { LoginInputDto } from './dto/login.input-dto';
import { LoginCommand } from '../application/auth-use-cases/login.use-case';
import { CommandBus } from '@nestjs/cqrs';
import { Tokens } from '../application/jwt.service';
import { RegistrationCommand } from '../../users/application/users-use-cases/registration.use-case';
import { ObjectId } from 'mongodb';
import { EmailResendCommand } from '../../users/application/users-use-cases/email-resend.use-case';
import { RegistrationConfirmCommand } from '../../users/application/users-use-cases/registration-confirm.use-case';
import { PasswordRecoveryCommand } from '../../users/application/users-use-cases/password-recovery.use-case';
import { PasswordUpdateCommand } from '../../users/application/users-use-cases/password-update.use-case';
import {
  CookieInterceptor,
  TokensResponseDto,
} from '../../../../core/interceptors/refresh-cookie.interceptor';
import { RefreshTokenCommand } from '../application/auth-use-cases/refresh-token.use-case';
import { RefreshGuard } from '../guards/bearer/jwt-refresh-auth-guard';
import { ClientInfo } from '../../../../core/decorators/client-info.decorator';
import { ClientInfoDto } from '../../devices/types/client-info.dto';
import { SoftRefreshStrategy } from '../guards/bearer/jwt-refresh-strategy';
import { LogoutCommand } from '../application/auth-use-cases/logout.use-case';
import { LogoutInterceptor } from '../../../../core/interceptors/logout.interceptor';
import { AuthSqlQueryRepository } from '../infrastructure/auth.sql.query-repository';
import { UsersSqlQueryRepository } from '../../users/infrastructure/repositories/users.sql.query.repository';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersQueryRepository: UsersSqlQueryRepository,
    private readonly authQueryRepository: AuthSqlQueryRepository,
    private readonly commandBus: CommandBus,
  ) {}

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: HttpStatus.OK, type: MeViewDto })
  @ApiOperation({ summary: 'Get info about current user' })
  async getMe(@ExtractUserFromRequest() user: UserContextDto) {
    return await this.authQueryRepository.getMe(user.id);
  }

  @Post('login')
  // @Throttle({ default: { limit: 5, ttl: 9000 } })
  @UseInterceptors(CookieInterceptor)
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @UseGuards(SoftRefreshStrategy)
  @ApiResponse({ type: ConfirmCodeViewDto })
  @ApiOperation({ summary: 'Login user into system.' })
  @ApiBody({ type: LoginInputDto })
  async login(
    @ExtractUserFromRequest() user: UserContextDto,
    @ClientInfo() clientInfo: ClientInfoDto,
  ) {
    const { accessToken, refreshToken }: Tokens = await this.commandBus.execute(
      new LoginCommand(user.id, clientInfo),
    );
    return new TokensResponseDto(accessToken, refreshToken);
  }

  @Post('registration')
  // @Throttle({ default: { limit: 5, ttl: 9000 } })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'User registration' })
  /** User registration endpoint */
  async registration(@Body() body: UserInputDto) {
    const createUserResult: ResultObject<{
      newUserId: ObjectId;
      emailConfirmCode: string;
    }> = await this.commandBus.execute(new RegistrationCommand(body));

    const newUser = await this.usersQueryRepository.getUserById(
      createUserResult.data.newUserId,
    );
    if (!newUser) {
      throw new InternalServerErrorException();
    }
    return newUser;
  }

  @Post('registration-confirmation')
  // @Throttle({ default: { limit: 5, ttl: 9000 } })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Confirm registration' })
  async registrationConfirm(@Body() body: ConfirmCodeViewDto) {
    await this.commandBus.execute(new RegistrationConfirmCommand(body));
    return true;
  }

  @Post('registration-email-resending')
  // @Throttle({ default: { limit: 5, ttl: 9000 } })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Email confirmation code send' })
  async registrationEmailResending(@Body() body: EmailResendingDto) {
    await this.commandBus.execute(new EmailResendCommand(body));
    return true;
  }

  @Post('password-recovery')
  // @Throttle({ default: { limit: 5, ttl: 9000 } })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Password recovery code send' })
  async passwordRecovery(@Body() body: PasswordRecoveryInputDto) {
    await this.commandBus.execute(new PasswordRecoveryCommand(body));

    return;
  }

  @Post('new-password')
  // @Throttle({ default: { limit: 5, ttl: 9000 } })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Set new password' })
  async newPassword(@Body() body: PasswordUpdateInputDto) {
    await this.commandBus.execute(new PasswordUpdateCommand(body));

    return true;
  }

  /** Refresh and access token sending*/
  @Post('refresh-token')
  // @Throttle({ default: { limit: 5, ttl: 9000 } })
  @UseInterceptors(CookieInterceptor)
  @UseGuards(RefreshGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh token' })
  async refreshToken(
    @ExtractUserFromRequest() user: UserRefreshContextDto,
    @ClientInfo() clientInfo: ClientInfoDto,
  ) {
    const {
      accessToken,
      refreshToken,
    }: { accessToken: string; refreshToken: string } =
      await this.commandBus.execute(new RefreshTokenCommand(user, clientInfo));
    return new TokensResponseDto(accessToken, refreshToken);
  }

  @Post('logout')
  @UseGuards(RefreshGuard)
  @UseInterceptors(LogoutInterceptor)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Logout' })
  async logout(@ExtractUserFromRequest() user: UserRefreshContextDto) {
    await this.commandBus.execute(new LogoutCommand(user));
    return;
  }
}
