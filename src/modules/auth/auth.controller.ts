import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { CommandBus } from '@nestjs/cqrs';
import { RegistrationCommand } from './use-cases/registration-use.case';
import { GoogleOAuthGuard } from './google/guard/google-oauth.guard';
import { AuthService } from './service/auth.service';

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
  async registrationConfirmation(@Body('code') code: string) {
    // return this.commandBus.execute()
  }
}
