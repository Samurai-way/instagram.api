import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor() {}

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Body() dto: UserProfileDto) {}
}
