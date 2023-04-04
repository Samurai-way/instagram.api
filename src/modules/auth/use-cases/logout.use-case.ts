import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CommandHandler, ICommand } from '@nestjs/cqrs';
import { AuthService } from '../service/auth.service';
import { DevicesRepository } from '../../devices/repository/devices.repository';

@Injectable()
export class LogoutCommand {
  constructor(readonly refreshToken: string) {}
}

@CommandHandler(LogoutCommand)
export class LogoutUseCase implements ICommand {
  constructor(
    public authService: AuthService,
    public devicesRepo: DevicesRepository,
  ) {}

  async execute(command: LogoutCommand) {
    if (!command.refreshToken)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    const lastActiveData = this.authService.getLastActiveDateFromRefreshToken(
      command.refreshToken,
    );
    if (!lastActiveData)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    const actualToken = await this.authService.tokenVerify(
      command.refreshToken,
    );
    if (!actualToken)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    const activeDevice =
      await this.devicesRepo.findDeviceByUserIdDeviceIdAndLastActiveDate(
        actualToken.userId,
        actualToken.deviceId,
        new Date(actualToken.iat * 1000).toISOString(),
      );
    return this.devicesRepo.deleteSessionByDeviceId(actualToken.deviceId);
  }
}
