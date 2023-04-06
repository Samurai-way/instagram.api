import { Controller, Delete, Get, HttpCode, Param } from '@nestjs/common';
import { Cookies } from '../auth/decorator/cookies.decorator';
import { CommandBus } from '@nestjs/cqrs';
import { GetAlldevicesCommand } from './use-cases/getAllDevices.use-case';
import { DeleteAlldevicesCommand } from './use-cases/deleteAlldevicesUseCase';
import { DeleteAllDevicesByDeviceIdCommand } from './use-cases/deleteAllDevicesByDeviceIdUseCase';
import { Devices } from '@prisma/client';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { deviceViewModelExample } from '../../../swagger/auth/Device/device=view=model-example';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('SecurityDevices')
@ApiTags('security')
@Controller('security')
export class DevicesController {
  constructor(public command: CommandBus) {}

  @Get('/devices')
  @ApiOperation({
    summary: 'Returns all devices with active sessions for current user',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    schema: { example: [deviceViewModelExample] },
  })
  @ApiUnauthorizedResponse({
    description:
      'If the JWT refreshToken inside cookie is missing, expired or incorrect',
  })
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
