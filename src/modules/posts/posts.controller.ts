import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
import { DeletePostByIdCommand } from './use-cases/delete-post-by-id.use-case';
import { PostsRepository } from './repository/posts.repository';

@Controller('posts')
export class PostsController {
  constructor(public command: CommandBus, public postsRepo: PostsRepository) {}

  @Get(':postId')
  async findPostById(@Param('postId') postId: string): Promise<Posts> {
    return this.postsRepo.findPostById(postId);
  }

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

  @Delete(':postId')
  @UseGuards(JwtAuthGuard)
  async deletePostById(
    @User() user: UserModel,
    @Param('postId') postId: string,
  ): Promise<Posts> {
    return this.command.execute(new DeletePostByIdCommand(user.id, postId));
  }
}
