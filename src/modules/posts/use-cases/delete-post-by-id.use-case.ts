import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommand } from '@nestjs/cqrs';
import { UsersRepository } from '../../users/repository/users.repository';
import { PostsRepository } from '../repository/posts.repository';
import { Posts } from '@prisma/client';

@Injectable()
export class DeletePostByIdCommand {
  constructor(readonly userId: string, readonly postId: string) {}
}
@CommandHandler(DeletePostByIdCommand)
export class DeletePostByIdUseCase implements ICommand {
  constructor(
    public usersRepo: UsersRepository,
    public postsRepo: PostsRepository,
  ) {}
  async execute({ userId, postId }: DeletePostByIdCommand): Promise<Posts> {
    const user = await this.usersRepo.findUserById(userId);
    if (!user) throw new NotFoundException();
    return this.postsRepo.deletePostById(postId);
  }
}
