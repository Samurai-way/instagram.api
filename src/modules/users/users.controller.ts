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
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserProfileDto } from './dto/user-profile-dto';
import { CommandBus } from '@nestjs/cqrs';
import { User } from '../auth/decorator/request.decorator';
import { UserModel } from '../../../swagger/User/user.model';
import { UpdateProfileCommand } from './use-cases/update-profile.use-case';
import { UserProfileModel } from './types/types';
import { FindProfileCommand } from './use-cases/find-profile.use-case';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileCommand } from './use-cases/upload-file.use-case';
import { ApiFindProfileSwagger } from '../../../swagger/User/api-find-profile';
import { ApiCreateAvatarSwagger } from '../../../swagger/User/api-create-avatar';
import { ApiUpdateProfileSwagger } from '../../../swagger/User/api-update-profile';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(public readonly commandBus: CommandBus) {}

  @Put('profile')
  @ApiUpdateProfileSwagger()
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @User() user: UserModel,
    @Body() dto: UserProfileDto,
  ): Promise<UserProfileModel> {
    return this.commandBus.execute(new UpdateProfileCommand(dto, user.id));
  }

  @Post('avatar')
  @ApiCreateAvatarSwagger()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImageForProfile(
    @UploadedFile() photo: Express.Multer.File,
    @User() user: UserModel,
  ): Promise<{ photo: string }> {
    return this.commandBus.execute(new UploadFileCommand(user.id, photo));
  }

  @Get('profile')
  @ApiFindProfileSwagger()
  @UseGuards(JwtAuthGuard)
  async findProfileByUserId(
    @User() user: UserModel,
  ): Promise<UserProfileModel> {
    return this.commandBus.execute(new FindProfileCommand(user.id));
  }
}
