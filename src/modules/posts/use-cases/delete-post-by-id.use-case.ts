import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommand } from '@nestjs/cqrs';
import { UsersRepository } from '../../users/repository/users.repository';
import { PostsRepository } from '../repository/posts.repository';
import { Posts } from '@prisma/client';
import { LogicError } from '../../helpers/logic-error-hadler';

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
    if (!user)
      throw new NotFoundException(new LogicError('user not found', 'user'));
    const post = await this.postsRepo.findPostById(postId);
    if (!post)
      throw new NotFoundException(new LogicError('post not found', 'post'));
    if (post.userId !== user.id)
      throw new ForbiddenException(new LogicError('Its not your post', 'post'));
    return this.postsRepo.deletePostById(postId);
  }
}
