import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommand } from '@nestjs/cqrs';
import { AuthService } from '../service/auth.service';
import { randomUUID } from 'crypto';
import { DevicesRepository } from '../../devices/repository/devices.repository';
import { UserModel } from '../../../../swagger/auth/User/user.model';

@Injectable()
export class LoginCommand {
  constructor(
    readonly ip: string,
    readonly title: string,
    readonly user: UserModel,
  ) {}
}

@CommandHandler(LoginCommand)
export class LoginUseCase implements ICommand {
  constructor(
    public authService: AuthService,
    public devicesRepo: DevicesRepository,
  ) {}

  async execute(
    command: LoginCommand,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const deviceId = randomUUID();
    const jwt = await this.authService.createJwtPair(command.user.id, deviceId);
    const lastActiveDate =
      await this.authService.getLastActiveDateFromRefreshToken(
        jwt.refreshToken,
      );
    await this.devicesRepo.createUserSession(
      command.ip,
      command.title,
      lastActiveDate,
      deviceId,
      command.user.id,
    );
    return jwt;
  }
}
