import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '../auth/decorator/request.decorator';
import { UserModel } from '../../../swagger/auth/User/user.model';
import { CreatePostDto } from './dto/createPost.dto';
import { Posts } from '@prisma/client';
import { CreatePostCommand } from './use-cases/create-post.use-case';

@Controller('posts')
export class PostsController {
  constructor(public command: CommandBus) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async createPost(
    @UploadedFile() photo: Express.Multer.File,
    @User() user: UserModel,
    @Body() dto: CreatePostDto,
  ): Promise<Posts> {
    console.log('dto', dto, 'photo', photo);
    return this.command.execute(
      new CreatePostCommand(user.id, photo, dto.description),
    );
  }
}
