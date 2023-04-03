import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { CommandBus } from '@nestjs/cqrs';
import { RegistrationCommand } from './use-cases/registration-use.case';
import { GoogleOAuthGuard } from './google/guard/google-oauth.guard';
import { AuthService } from './service/auth.service';
import { ConfirmationCommand } from './use-cases/confirmation.use-case';
import { EmailConfirmation } from '@prisma/client';
import { EmailResendingCommand } from './use-cases/emailResending.use-case';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from './decorator/request.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private commandBus: CommandBus,
    private readonly authService: AuthService,
  ) {}

  @Post('/registration')
  @HttpCode(204)
  async registration(@Body() dto: AuthDto): Promise<boolean> {
    return this.commandBus.execute(new RegistrationCommand(dto));
  }

  @Get()
  @UseGuards(GoogleOAuthGuard)
  async googleAuth(@Request() req) {}

  @Get('google-redirect')
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect(@Request() req) {
    return this.authService.googleLogin(req);
  }

  @Post('/registration-confirmation')
  @HttpCode(204)
  async registrationConfirmation(
    @Body('code') code: string,
  ): Promise<EmailConfirmation> {
    return this.commandBus.execute(new ConfirmationCommand(code));
  }

  @Post('/registration-email-resending')
  @HttpCode(204)
  async registrationEmailResending(
    @Body('email') email: string,
  ): Promise<boolean> {
    return this.commandBus.execute(new EmailResendingCommand(email));
  }

  @UseGuards(LocalAuthGuard)
  // @Throttle(5, 10)
  @HttpCode(200)
  @Post('/login')
  async userLogin(
    @User() user: any,
    // @Req() req: Request,
    // @Res({ passthrough: true }) res: Response,
  ) {}
  // : Promise<{ accessToken: string }> {
  const ip = req.ip;
  const title = req.headers['user-agent'] || 'browser not found';
  const { accessToken, refreshToken } = await this.commandBus.execute(
    new LoginCommand(ip, title, user),
  );
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
  });
  return { accessToken: accessToken };
  }
}
