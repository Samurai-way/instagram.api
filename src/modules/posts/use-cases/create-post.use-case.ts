import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { CreatePostDto } from '../dto/createPost.dto';
import { UsersRepository } from '../../users/repository/users.repository';
import { S3FilesRepository } from '../../adapters/AWS/s3-filesRepository';
import { PostsRepository } from '../repository/posts.repository';
import { Posts } from '@prisma/client';

@Injectable()
export class CreatePostCommand {
  constructor(
    readonly photo: Express.Multer.File,
    readonly userId: string,
    readonly dto: CreatePostDto,
  ) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase {
  constructor(
    public usersRepo: UsersRepository,
    public s3Repo: S3FilesRepository,
    public postsRepo: PostsRepository,
  ) {}

  async execute({ userId, dto, photo }: CreatePostCommand): Promise<Posts> {
    const user = await this.usersRepo.findUserById(userId);
    if (!user) throw new NotFoundException();
    const savedPhoto = await this.s3Repo.saveFile(
      photo.buffer,
      photo.fieldname,
      photo.mimetype,
    );
    const { photo: postPhoto } = await this.usersRepo.updateUserAvatarByUserId(
      userId,
      savedPhoto.url,
    );
    return this.postsRepo.createPost(dto.description, userId, postPhoto);
  }
}
