import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../users/repository/users.repository';
import { S3FilesRepository } from '../../adapters/AWS/s3-filesRepository';
import { PostsRepository } from '../repository/posts.repository';
import { Posts } from '@prisma/client';

@Injectable()
export class CreatePostCommand {
  constructor(
    readonly userId: string,
    readonly postPhoto: Express.Multer.File,
    readonly description: string,
  ) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase {
  constructor(
    public usersRepo: UsersRepository,
    public s3Repo: S3FilesRepository,
    public postsRepo: PostsRepository,
  ) {}

  async execute({
    userId,
    postPhoto,
    description,
  }: CreatePostCommand): Promise<Posts> {
    const user = await this.usersRepo.findUserById(userId);
    if (!user) throw new NotFoundException();
    const photoToAWS = await this.s3Repo.saveFile(
      postPhoto.buffer,
      postPhoto.fieldname,
      postPhoto.mimetype,
    );
    return this.postsRepo.createPost(description, userId, photoToAWS.url);
  }
}
