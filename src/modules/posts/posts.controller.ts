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
import { UserModel } from '../../../swagger/auth/User/user.model';
import { CreatePostDto, UpdatePostDto } from './dto/post.dtos';
import { Posts } from '@prisma/client';
import { CreatePostCommand } from './use-cases/create-post.use-case';
import { DeletePostByIdCommand } from './use-cases/delete-post-by-id.use-case';
import { PostsRepository } from './repository/posts.repository';
import { UpdatePostByIdCommand } from './use-cases/update-post-by-id.use-case';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { apiBody } from 'swagger/Post/api-body';
import { apiResponse } from '../../../swagger/Post/api-response';
import { PostViewModel } from './dto/postViewModel';
import { apiBadRequestResponse } from '../../../swagger/Post/api-bad-request-response';
import { apiUnauthorizedResponse } from '../../../swagger/Post/api-unauthorized-response';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(public command: CommandBus, public postsRepo: PostsRepository) {}

  @Get(':postId')
  @ApiOperation({ summary: 'Find post by id' })
  @ApiResponse(apiResponse('Find post by id', PostViewModel))
  @ApiBadRequestResponse(apiBadRequestResponse)
  async findPostById(@Param('postId') postId: string): Promise<Posts> {
    return this.postsRepo.findPostById(postId);
  }

  @Post()
  @ApiOperation({ summary: 'Create post' })
  @ApiBody(apiBody(CreatePostDto))
  @ApiResponse(apiResponse('Return created post', PostViewModel, 201))
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse(apiBadRequestResponse)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
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
  @ApiOperation({ summary: 'Delete post by id' })
  @ApiResponse({ status: 204 })
  @ApiUnauthorizedResponse(apiUnauthorizedResponse)
  @ApiBadRequestResponse(apiBadRequestResponse)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePostById(
    @User() user: UserModel,
    @Param('postId') postId: string,
  ): Promise<Posts> {
    return this.command.execute(new DeletePostByIdCommand(user.id, postId));
  }

  @Put(':postId')
  @ApiOperation({ summary: 'Update post by id' })
  @ApiBody(apiBody(UpdatePostDto))
  @ApiResponse(apiResponse('Returns updated post', PostViewModel))
  @ApiUnauthorizedResponse(apiUnauthorizedResponse)
  @ApiBadRequestResponse()
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
