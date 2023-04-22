import { Controller, Delete, Get, HttpCode, Param } from '@nestjs/common';
import { Cookies } from '../auth/decorator/cookies.decorator';
import { CommandBus } from '@nestjs/cqrs';
import { GetAlldevicesCommand } from './use-cases/getAllDevices.use-case';
import { DeleteAlldevicesCommand } from './use-cases/deleteAlldevicesUseCase';
import { DeleteAllDevicesByDeviceIdCommand } from './use-cases/deleteAllDevicesByDeviceIdUseCase';
import { Devices } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { ApiDeleteDeviceByIdSwagger } from '../../../swagger/Device/api-delete-device-by-id';
import { ApiDeleteAllDevicesSwagger } from '../../../swagger/Device/api-delete-all-devices';
import { ApiFindAllDevicesSwagger } from '../../../swagger/Device/api-find-all-devices';

@ApiTags('Devices')
@Controller('security')
export class DevicesController {
  constructor(public command: CommandBus) {}

  @Get('/devices')
  @ApiFindAllDevicesSwagger()
  async getAllDevices(@Cookies() cookies): Promise<Devices[]> {
    return this.command.execute(new GetAlldevicesCommand(cookies.refreshToken));
  }

  @Delete('/devices')
  @ApiDeleteAllDevicesSwagger()
  @HttpCode(204)
  async deleteAllDevices(@Cookies() cookies): Promise<void> {
    return this.command.execute(
      new DeleteAlldevicesCommand(cookies.refreshToken),
    );
  }

  @Delete('/devices/:deviceId')
  @ApiDeleteDeviceByIdSwagger()
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
