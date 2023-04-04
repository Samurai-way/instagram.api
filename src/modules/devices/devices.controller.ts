import { Controller, Delete, Get, HttpCode, Param } from '@nestjs/common';
import { Cookies } from '../auth/decorator/cookies.decorator';
import { CommandBus } from '@nestjs/cqrs';
import { GetAlldevicesCommand } from './use-cases/getAllDevices.use-case';
import { DeleteAlldevicesCommand } from './use-cases/deleteAlldevicesUseCase';
import { DeleteAllDevicesByDeviceIdCommand } from './use-cases/deleteAllDevicesByDeviceIdUseCase';
import { Devices } from '@prisma/client';

@Controller('security')
export class DevicesController {
  constructor(public command: CommandBus) {}

  @Get('/devices')
  async getAllDevices(@Cookies() cookies): Promise<Devices[]> {
    return this.command.execute(new GetAlldevicesCommand(cookies.refreshToken));
  }

  @Delete('/devices')
  @HttpCode(204)
  async deleteAllDevices(@Cookies() cookies): Promise<void> {
    return this.command.execute(
      new DeleteAlldevicesCommand(cookies.refreshToken),
    );
  }

  @Delete('/devices/:deviceId')
  @HttpCode(204)
  async deleteDevicesByDeviceId(
    @Cookies() cookies,
    @Param('deviceId') deviceId: string,
  ) {
    return this.command.execute(
      new DeleteAllDevicesByDeviceIdCommand(cookies.refreshToken, deviceId),
    );
  }
}
