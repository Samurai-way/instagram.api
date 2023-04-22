import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CommandBus } from '@nestjs/cqrs';
import { ConfirmationCommand } from './use-cases/confirmation.use-case';
import { EmailResendingCommand } from './use-cases/emailResending.use-case';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from './decorator/request.decorator';
import { GoogleOAuthGuard } from './google/guard/google-oauth.guard';
import { Cookies } from './decorator/cookies.decorator';
import { LogoutCommand } from './use-cases/logout.use-case';
import { Throttle } from '@nestjs/throttler';
import { LoginCommand } from './use-cases/login.use-case';
import { Ip } from './decorator/ip.decorator';
import { RefreshTokenCommand } from './use-cases/refreshToken.use-case';
import { IpDto } from './dto/api.dto';
import { PasswordRecoveryCommand } from './use-cases/passwordRecovery.use-case';
import { NewPasswordCommand } from './use-cases/newPassword.use-case';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import {
  AuthDto,
  ConfirmationCodeDto,
  EmailDto,
  NewPasswordDto,
} from './dto/auth.dto';
import { RegistrationCommand } from './use-cases/registration-use.case';
import { UserModel } from '../../../swagger/User/user.model';
import { EmailConfirmation } from '../../../swagger/User/email-confirmation-model';
import { GoogleAuthDecorator } from './decorator/google.decorator';
import { GoogleAuthCommand } from './use-cases/google-auth.use-case';
import { DeviceInfoDecorator } from './decorator/device-info.decorator';
import { RecaptchaGuard } from './guards/recaptcha.guard';
import { ApiMeSwagger } from '../../../swagger/Auth/api-me';
import { ApiLogoutSwagger } from '../../../swagger/Auth/api-logout';
import { ApiNewPasswordSwagger } from '../../../swagger/Auth/api-new-password';
import { ApiPasswordRecoverySwagger } from '../../../swagger/Auth/api-password-recovery';
import { ApiRefreshTokenSwagger } from '../../../swagger/Auth/api-refresh-token';
import { ApiLoginSwagger } from '../../../swagger/Auth/api-login';
import { ApiRegistrationEmailResendingSwagger } from '../../../swagger/Auth/api-registration-email-resending';
import { ApiRegistrationConfirmationSwagger } from '../../../swagger/Auth/api-registration-confirmation';
import { ApiGoogleSwagger } from '../../../swagger/Auth/api-google';
import { ApiRegistrationSwagger } from '../../../swagger/Auth/api-registration';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private commandBus: CommandBus) {}

  @Post('/registration')
  @ApiRegistrationSwagger()
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(
    @Body() dto: AuthDto,
  ): Promise<{ result: boolean; data: { key: string } }> {
    return this.commandBus.execute(new RegistrationCommand(dto));
  }

  @Get('/google')
  @Throttle(5, 10)
  @ApiGoogleSwagger()
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {}

  @Get('google-redirect')
  @ApiExcludeEndpoint()
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(
    @GoogleAuthDecorator() dto: AuthDto,
    @DeviceInfoDecorator() info,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.commandBus.execute(
      new GoogleAuthCommand(dto, info),
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: false,
      secure: false,
    });
    return { accessToken: accessToken };
  }

  @Post('/registration-confirmation')
  @Throttle(5, 10)
  @ApiRegistrationConfirmationSwagger()
  @HttpCode(204)
  async registrationConfirmation(
    @Body() dto: ConfirmationCodeDto,
  ): Promise<EmailConfirmation> {
    return this.commandBus.execute(new ConfirmationCommand(dto));
  }

  @Post('/registration-email-resending')
  @Throttle(5, 10)
  @ApiRegistrationEmailResendingSwagger()
  @HttpCode(204)
  async registrationEmailResending(@Body() dto: EmailDto): Promise<boolean> {
    return this.commandBus.execute(new EmailResendingCommand(dto));
  }

  @Post('/login')
  @UseGuards(LocalAuthGuard, RecaptchaGuard)
  @Throttle(5, 10)
  @HttpCode(200)
  @ApiLoginSwagger()
  async userLogin(
    @User() user: UserModel,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const ip = req.ip;
    const title = req.headers['user-agent'] || 'browser not found';
    const { accessToken, refreshToken } = await this.commandBus.execute(
      new LoginCommand(ip, title, user),
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: false,
      secure: false,
    });
    return { accessToken: accessToken };
  }

  @Post('/refresh-token')
  @ApiRefreshTokenSwagger()
  @HttpCode(200)
  async userRefreshToken(
    @Cookies() cookies,
    @Ip() ip: IpDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const updateToken = await this.commandBus.execute(
      new RefreshTokenCommand(ip, cookies.refreshToken),
    );
    res.cookie('refreshToken', updateToken.refreshToken, {
      httpOnly: false,
      secure: false,
    });
    return updateToken;
  }

  @Post('/password-recovery')
  @Throttle(5, 10)
  @ApiPasswordRecoverySwagger()
  @HttpCode(204)
  async userPasswordRecovery(@Body() dto: EmailDto): Promise<boolean> {
    return this.commandBus.execute(new PasswordRecoveryCommand(dto));
  }

  @Post('/new-password')
  @Throttle(5, 10)
  @ApiNewPasswordSwagger()
  @HttpCode(204)
  async userNewPassword(@Body() dto: NewPasswordDto) {
    return this.commandBus.execute(new NewPasswordCommand(dto));
  }

  @Post('/logout')
  @ApiLogoutSwagger()
  @HttpCode(204)
  async userLogout(@Cookies() cookies): Promise<boolean> {
    return this.commandBus.execute(new LogoutCommand(cookies.refreshToken));
  }

  @Get('/me')
  @ApiMeSwagger()
  @UseGuards(JwtAuthGuard)
  async getUser(
    @User() user: UserModel,
  ): Promise<{ email: string; login: string; userId: string }> {
    return { email: user.email, login: user.login, userId: user.id };
  }
}
