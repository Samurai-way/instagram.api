import { Injectable } from '@nestjs/common';
import { AuthDto } from '../dto/auth.dto';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../users/repository/users.repository';
import { RegistrationCommand } from './registration-use.case';
import { AuthService } from '../service/auth.service';
import { DevicesRepository } from '../../devices/repository/devices.repository';

@Injectable()
export class GoogleAuthCommand {
  constructor(readonly dto: AuthDto, readonly info) {}
}

@CommandHandler(GoogleAuthCommand)
export class GoogleAuthUseCase implements ICommandHandler<GoogleAuthCommand> {
  constructor(
    public usersRepo: UsersRepository,
    private commandBus: CommandBus,
    public authService: AuthService,
    public devicesRepo: DevicesRepository,
  ) {}

  async execute(
    command: GoogleAuthCommand,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.usersRepo.findUserByEmail(command.dto.email);
    if (!user) {
      const newUser = await this.commandBus.execute(
        new RegistrationCommand(command.dto),
      );
      const jwt = await this.authService.createJwtPair(
        newUser.id,
        command.info.deviceId,
      );
      const lastActiveDate =
        await this.authService.getLastActiveDateFromRefreshToken(
          jwt.refreshToken,
        );
      await this.devicesRepo.createUserSession(
        command.info.ip,
        command.info.title,
        lastActiveDate,
        command.info.deviceId,
        newUser.id,
      );
      return jwt;
    } else {
      const jwt = await this.authService.createJwtPair(
        user.id,
        command.info.deviceId,
      );

      const lastActiveDate =
        await this.authService.getLastActiveDateFromRefreshToken(
          jwt.refreshToken,
        );
      await this.devicesRepo.createUserSession(
        command.info.ip,
        command.info.title,
        lastActiveDate,
        command.info.deviceId,
        user.id,
      );
      return jwt;
    }
  }
}
