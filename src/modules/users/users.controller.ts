import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserProfileDto } from './dto/user-profile-dto';
import { BadRequestApi } from '../../../swagger/auth/bad-request-schema-example';
import {
  userProfile,
  userProfilePhoto,
} from '../../../swagger/User/user-profile';
import { CommandBus } from '@nestjs/cqrs';
import { User } from '../auth/decorator/request.decorator';
import { UserModel } from '../../../swagger/User/user.model';
import { UpdateProfileCommand } from './use-cases/update-profile.use-case';
import { UserProfileModel } from './types/types';
import { FindProfileCommand } from './use-cases/find-profile.use-case';
import { fileSchema } from '../../../swagger/User/file-schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileCommand } from './use-cases/upload-file.use-case';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(public readonly commandBus: CommandBus) {}

  @Put('profile')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiBody({
    description: 'Example request body (all fields not required)',
    type: UserProfileDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns updated profile',
    schema: { example: userProfile },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiBadRequestResponse({
    description: 'If the inputModel has incorrect values',
    schema: BadRequestApi,
  })
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @User() user: UserModel,
    @Body() dto: UserProfileDto,
  ): Promise<UserProfileModel> {
    return this.commandBus.execute(new UpdateProfileCommand(dto, user.id));
  }

  @Post('avatar')
  @ApiOperation({
    summary: 'Upload users avatar',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: fileSchema })
  @ApiResponse({
    status: 201,
    description: 'Return profile photo',
    schema: { example: userProfilePhoto },
  })
  @ApiBadRequestResponse({
    description: 'If file format is incorrect',
    schema: BadRequestApi,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImageForProfile(
    @UploadedFile() photo: Express.Multer.File,
    @User() user: UserModel,
  ): Promise<{ photo: string }> {
    return this.commandBus.execute(new UploadFileCommand(user.id, photo));
  }

  @Get('profile')
  @ApiOperation({ summary: 'Users profile with his information' })
  @ApiResponse({
    status: 200,
    description: 'Successfully return users profile',
    schema: { example: userProfile },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @UseGuards(JwtAuthGuard)
  async findProfileByUserId(
    @User() user: UserModel,
  ): Promise<UserProfileModel> {
    return this.commandBus.execute(new FindProfileCommand(user.id));
  }
}
