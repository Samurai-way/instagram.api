import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommand } from '@nestjs/cqrs';
import { AuthService } from '../service/auth.service';
import { randomUUID } from 'crypto';
import { UserModel } from '../../users/types/types';

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
  constructor(public authService: AuthService) {}

  async execute(
    command: LoginCommand,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const deviceId = randomUUID();
    return this.authService.createJwtPair(command.user.id, deviceId);
  }
}
