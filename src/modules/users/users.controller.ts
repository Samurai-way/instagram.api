import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserProfileDto } from './dto/user-profile-dto';
import { BadRequestApiExample } from '../../../swagger/auth/bad-request-schema-example';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor() {}

  @ApiOperation({ summary: 'Update current user profile' })
  @ApiBody({
    description: 'Example request body (all fields not required)',
    type: UserProfileDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns updated profile',
    schema: { example: userProfileExample },
  })
  @ApiUnauthorizedResponse({
    description: unauthorizedSwaggerMessage,
  })
  @ApiBadRequestResponse({
    description: badRequestSwaggerMessage,
    schema: BadRequestApiExample,
  })
  @Put('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Body() dto: UserProfileDto) {}
}
