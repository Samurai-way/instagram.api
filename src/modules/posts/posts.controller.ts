import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '../auth/decorator/request.decorator';
import { UserModel } from '../../../swagger/User/user.model';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { Posts } from '@prisma/client';
import { CreatePostCommand } from './use-cases/create-post.use-case';
import { DeletePostByIdCommand } from './use-cases/delete-post-by-id.use-case';
import { PostsRepository } from './repository/posts.repository';
import { UpdatePostByIdCommand } from './use-cases/update-post-by-id.use-case';
import { ApiTags } from '@nestjs/swagger';
import { ApiUpdatePostSwagger } from '../../../swagger/Post/api-update-post';
import { ApiDeletePostByIdSwagger } from '../../../swagger/Post/api-delete-post-by-id';
import { ApiCreatePostSwagger } from '../../../swagger/Post/api-create-post';
import { ApiFindPostByIdSwagger } from '../../../swagger/Post/api-find-post-by-id';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(public command: CommandBus, public postsRepo: PostsRepository) {}

  @Get(':postId')
  @ApiFindPostByIdSwagger()
  async findPostById(@Param('postId') postId: string): Promise<Posts> {
    return this.postsRepo.findPostById(postId);
  }

  @Post()
  @ApiCreatePostSwagger()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  async createPost(
    @UploadedFile() photo: Express.Multer.File,
    @User() user: UserModel,
    @Body() dto: CreatePostDto,
  ): Promise<Posts> {
    return this.command.execute(
      new CreatePostCommand(user.id, photo, dto.description),
    );
  }

  @Delete(':postId')
  @ApiDeletePostByIdSwagger()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePostById(
    @User() user: UserModel,
    @Param('postId') postId: string,
  ): Promise<Posts> {
    return this.command.execute(new DeletePostByIdCommand(user.id, postId));
  }

  @Put(':postId')
  @ApiUpdatePostSwagger()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updatePostById(
    @User() user: UserModel,
    @Param('postId') postId: string,
    @Body() dto: UpdatePostDto,
  ): Promise<Posts> {
    return this.command.execute(
      new UpdatePostByIdCommand(postId, user.id, dto.description),
    );
  }
}
