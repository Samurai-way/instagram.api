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
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiExcludeEndpoint,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BadRequestApi } from '../../../swagger/auth/bad-request-schema-example';
import { tooManyRequestsMessage } from '../../../swagger/auth/too-many-requests-message';
import { AuthUserDataModel } from '../../../swagger/auth/auth-user-model';
import { AuthCredentialsModel } from '../../../swagger/auth/auth-credentials-model';
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

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private commandBus: CommandBus) {}

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
    schema: BadRequestApi,
  })
  @ApiTooManyRequestsResponse({ description: tooManyRequestsMessage })
  @Post('/registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(
    @Body() dto: AuthDto,
  ): Promise<{ result: boolean; data: { key: string } }> {
    return this.commandBus.execute(new RegistrationCommand(dto));
  }

  @Get('/google')
  @Throttle(5, 10)
  @ApiBadRequestResponse({
    description: 'If the inputModel has incorrect values',
    schema: BadRequestApi,
  })
  @ApiUnauthorizedResponse({ description: 'If the password or login is wrong' })
  @ApiOperation({ summary: 'Try login user to the system with google account' })
  @ApiResponse({
    status: 200,
    description:
      'Returns JWT accessToken (expired after 8 hours) in body and JWT refreshToken in cookie (http-only, secure) (expired after 30d ays).',
    schema: { example: { accessToken: 'string' } },
  })
  @ApiTooManyRequestsResponse({ description: tooManyRequestsMessage })
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

  @Throttle(5, 10)
  @Post('/registration-confirmation')
  @ApiOperation({ summary: 'Confirm registration.' })
  @ApiResponse({
    status: 204,
    description: 'Email was verified. Account was activated',
  })
  @ApiBadRequestResponse({
    description:
      'If the confirmation code is incorrect, expired or already been applied',
    schema: BadRequestApi,
  })
  @ApiTooManyRequestsResponse({ description: tooManyRequestsMessage })
  @HttpCode(204)
  async registrationConfirmation(
    @Body() dto: ConfirmationCodeDto,
  ): Promise<EmailConfirmation> {
    return this.commandBus.execute(new ConfirmationCommand(dto));
  }

  @Throttle(5, 10)
  @Post('/registration-email-resending')
  @ApiOperation({
    summary: 'Resend confirmation registration Email if user exists',
  })
  @ApiResponse({
    status: 204,
    description:
      'Input data is accepted.Email with confirmation code will be send to passed email address.Confirmation code should be inside link as query param, for example: https://some-front.com/confirm-registration?code=youtcodehere',
  })
  @ApiBadRequestResponse({
    description: 'If the inputModel has incorrect values',
    schema: BadRequestApi,
  })
  @ApiTooManyRequestsResponse({ description: tooManyRequestsMessage })
  @HttpCode(204)
  async registrationEmailResending(@Body() dto: EmailDto): Promise<boolean> {
    return this.commandBus.execute(new EmailResendingCommand(dto));
  }

  @UseGuards(LocalAuthGuard)
  @Throttle(5, 10)
  @HttpCode(200)
  @ApiBadRequestResponse({
    description: 'If the inputModel has incorrect values',
    schema: BadRequestApi,
  })
  @ApiUnauthorizedResponse({ description: 'If the password or login is wrong' })
  @ApiOperation({ summary: 'Try login user to the system' })
  @ApiBody({ description: 'Example request body', type: AuthCredentialsModel })
  @ApiResponse({
    status: 200,
    description:
      'Returns JWT accessToken (expired after 8 hours) in body and JWT refreshToken in cookie (http-only, secure) (expired after 30d ays).',
    schema: { example: { accessToken: 'string' } },
  })
  @ApiTooManyRequestsResponse({ description: tooManyRequestsMessage })
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
  @ApiOperation({
    summary:
      'Generate new pair of access and refresh tokens (in cookie client must send correct refreshToken that will be revoked after refreshing). ' +
      'Device LastActiveDate should be overrode by issued Date of new refresh token',
  })
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description:
      'Returns JWT accessToken (expired after 8 hours) in body and JWT refreshToken in cookie (http-only, secure) (expired after 30days).',
    schema: { example: { accessToken: 'string' } },
  })
  @ApiUnauthorizedResponse({
    description:
      'If the JWT refreshToken inside cookie is missing, expired or incorrect',
  })
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
  @ApiOperation({
    summary:
      'Password recovery via Email confirmation. Email should be sent with RecoveryCode inside',
  })
  @ApiResponse({
    status: 204,
    description:
      "Even if current email is not registered (for prevent user's email detection)",
  })
  @ApiBadRequestResponse({
    description:
      'If the inputModel has invalid email (for example 222^gmail.com)',
  })
  @ApiTooManyRequestsResponse({ description: tooManyRequestsMessage })
  @HttpCode(204)
  async userPasswordRecovery(@Body() dto: EmailDto): Promise<boolean> {
    return this.commandBus.execute(new PasswordRecoveryCommand(dto));
  }

  @Throttle(5, 10)
  @Post('/new-password')
  @ApiOperation({ summary: 'Confirm password recovery' })
  @ApiResponse({
    status: 204,
    description: 'If code is valid and new password is accepted',
  })
  @ApiForbiddenResponse({ description: 'If code is wrong' })
  @ApiTooManyRequestsResponse({ description: tooManyRequestsMessage })
  @ApiNotFoundResponse({ description: 'If user with this code doesnt exist' })
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
