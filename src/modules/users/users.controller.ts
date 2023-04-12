import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
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
import { userProfileExample } from '../../../swagger/auth/User/user-profile-example';
import { CommandBus } from '@nestjs/cqrs';
import { User } from '../auth/decorator/request.decorator';
import { UserModel } from '../../../swagger/auth/User/user.model';
import { UpdateProfileCommand } from './use-cases/update-profile.use-case';
import { UserProfileModel } from './types/types';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(public readonly commandBus: CommandBus) {}

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
    description: 'Unauthorized',
  })
  @ApiBadRequestResponse({
    description: 'If the inputModel has incorrect values',
    schema: BadRequestApiExample,
  })
  @Put('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @User() user: UserModel,
    @Body() dto: UserProfileDto,
  ): Promise<UserProfileModel> {
    return this.commandBus.execute(new UpdateProfileCommand(dto, user.id));
  }

  @Get('profile/:userId')
  @ApiOperation({ summary: 'Get user profile by id of user' })
  @ApiResponse({
    status: 200,
    description: 'Returns user profile',
    schema: { example: userProfileExample },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  async findProfileByUserId(@Param('userId') userId: string) {
    // return this.
  }
}
