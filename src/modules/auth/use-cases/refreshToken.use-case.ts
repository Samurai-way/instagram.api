import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../service/auth.service';
import { DevicesRepository } from '../../devices/repository/devices.repository';
import { IpDto } from '../dto/api.dto';

@Injectable()
export class RefreshTokenCommand {
  constructor(readonly dto: IpDto, readonly refreshToken: string) {}
}

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenUseCase
  implements ICommandHandler<RefreshTokenCommand>
{
  constructor(
    public authService: AuthService,
    public devicesRepository: DevicesRepository,
  ) {}

  async execute(
    command: RefreshTokenCommand,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const jwt = await this.authService.tokenVerify(command.refreshToken);
    if (!jwt) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    const isActiveDevice =
      await this.devicesRepository.findDeviceByUserIdDeviceIdAndLastActiveDate(
        jwt.userId,
        jwt.deviceId,
        new Date(jwt.iat * 1000).toISOString(),
      );
    if (!isActiveDevice)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    const jwtTokens = await this.authService.createJwtPair(
      jwt.userId,
      jwt.deviceId,
    );
    const lastActiveData = this.authService.getLastActiveDateFromRefreshToken(
      jwtTokens.refreshToken,
    );
    if (!lastActiveData) throw new UnauthorizedException([]);
    await this.devicesRepository.updateUserSessionById(
      command.dto.ip,
      command.dto.title,
      lastActiveData,
      jwt.deviceId,
      jwt.userId,
    );
    return jwtTokens;
  }
}
