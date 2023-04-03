import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CommandHandler, ICommand } from '@nestjs/cqrs';
import { AuthService } from '../service/auth.service';

@Injectable()
export class LogoutCommand {
  constructor(readonly refreshToken: string) {}
}

@CommandHandler(LogoutCommand)
export class LogoutUseCase implements ICommand {
  constructor(public authService: AuthService) {}

  async execute(command: LogoutCommand) {
    if (!command.refreshToken)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    const lastActiveDate = this.authService.getLastActiveDateFromRefreshToken(
      command.refreshToken,
    );
    if (!lastActiveDate)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    const actualToken = await this.authService.tokenVerify(
      command.refreshToken,
    );
    if (!actualToken)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    return true;
  }
}
