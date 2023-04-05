import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthDto, NewPasswordDto } from './dto/auth.dto';
import { CommandBus } from '@nestjs/cqrs';
import { RegistrationCommand } from './use-cases/registration-use.case';
import { ConfirmationCommand } from './use-cases/confirmation.use-case';
import { EmailConfirmation } from '@prisma/client';
import { EmailResendingCommand } from './use-cases/emailResending.use-case';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from './decorator/request.decorator';
import { GoogleOAuthGuard } from './google/guard/google-oauth.guard';
import { UserModel } from '../users/types/types';
import { Cookies } from './decorator/cookies.decorator';
import { LogoutCommand } from './use-cases/logout.use-case';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './service/auth.service';
import { LoginCommand } from './use-cases/login.use-case';
import { Ip } from './decorator/ip.decorator';
import { RefreshTokenCommand } from './use-cases/refreshToken.use-case';
import { IpDto } from './dto/api.dto';
import { PasswordRecoveryCommand } from './use-cases/passwordRecovery.use-case';
import { NewPasswordCommand } from './use-cases/newPassword.use-case';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BadRequestApiExample } from '../../../swagger/auth/bad-request-schema-example';
import { tooManyRequestsMessage } from '../../../swagger/auth/too-many-requests-message';
import { AuthUserDataModel } from '../../../swagger/auth/auth-user-model';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private commandBus: CommandBus,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({
    summary:
      'Registration in the system. Email with confirmation code will be send to passed email address.',
  })
  @ApiResponse({
    status: 204,
    description:
      'Input data is accepted. Email with confirmation code will be send to passed email address',
  })
  @ApiBadRequestResponse({
    description:
      'If the inputModel has incorrect values (in particular if the user with the given email or login already exists)',
    schema: BadRequestApiExample,
  })
  @ApiTooManyRequestsResponse({ description: tooManyRequestsMessage })
  @Post('/registration')
  @HttpCode(204)
  async registration(@Body() dto: AuthDto): Promise<boolean> {
    return this.commandBus.execute(new RegistrationCommand(dto));
  }

  @Get()
  @UseGuards(GoogleOAuthGuard)
  async googleAuth(@Req() req: Request) {}

  @Get('google-redirect')
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect(@Req() req: Request) {
    return this.authService.googleLogin(req);
  }

  @Throttle(5, 10)
  @Post('/registration-confirmation')
  @HttpCode(204)
  async registrationConfirmation(
    @Body('code') code: string,
  ): Promise<EmailConfirmation> {
    return this.commandBus.execute(new ConfirmationCommand(code));
  }

  @Throttle(5, 10)
  @Post('/registration-email-resending')
  @HttpCode(204)
  async registrationEmailResending(
    @Body('email') email: string,
  ): Promise<boolean> {
    return this.commandBus.execute(new EmailResendingCommand(email));
  }

  @UseGuards(LocalAuthGuard)
  @Throttle(5, 10)
  @HttpCode(200)
  @Post('/login')
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

  @Throttle(5, 10)
  @Post('/password-recovery')
  @HttpCode(204)
  async userPasswordRecovery(@Body('email') email: string): Promise<boolean> {
    return this.commandBus.execute(new PasswordRecoveryCommand(email));
  }

  @Throttle(5, 10)
  @Post('/new-password')
  @HttpCode(204)
  async userNewPassword(@Body() dto: NewPasswordDto) {
    return this.commandBus.execute(new NewPasswordCommand(dto));
  }

  @Post('/logout')
  @ApiOperation({
    summary:
      'In cookie client must send correct refreshToken that will be revoked',
  })
  @ApiResponse({
    status: 204,
    description: 'No content',
  })
  @ApiUnauthorizedResponse({
    description:
      'If the JWT refreshToken inside cookie is missing, expired or incorrect',
  })
  @HttpCode(204)
  async userLogout(@Cookies() cookies): Promise<boolean> {
    return this.commandBus.execute(new LogoutCommand(cookies.refreshToken));
  }

  @Get('/me')
  @ApiOperation({ summary: 'Get information about current user' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    schema: {
      example: {
        email: 'string',
        login: 'string',
        userId: 'string',
      } as AuthUserDataModel,
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  async getUser(
    @User() user: UserModel,
  ): Promise<{ email: string; login: string; userId: string }> {
    return { email: user.email, login: user.login, userId: user.id };
  }
}
