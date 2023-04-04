import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommand } from '@nestjs/cqrs';
import { AuthService } from '../../auth/service/auth.service';
import { DevicesRepository } from '../repository/devices.repository';
import { Devices } from '@prisma/client';

@Injectable()
export class GetAlldevicesCommand {
  constructor(readonly refreshToken: string) {}
}

@CommandHandler(GetAlldevicesCommand)
export class GetAlldevicesUseCase implements ICommand {
  constructor(
    public authService: AuthService,
    public devicesRepo: DevicesRepository,
  ) {}

  async execute(command: GetAlldevicesCommand): Promise<Devices[]> {
    if (!command.refreshToken) throw new UnauthorizedException([]);
    const user = await this.authService.tokenVerify(command.refreshToken);
    if (!user) throw new UnauthorizedException([]);
    const userId = user.userId;
    return this.devicesRepo.findAllUserDevicesByUserId(userId);
  }
}
