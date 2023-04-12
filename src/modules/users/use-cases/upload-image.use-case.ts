import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommand } from '@nestjs/cqrs';
import { UsersRepository } from '../repository/users.repository';

@Injectable()
export class UploadImageCommand {
  constructor(readonly photo: Express.Multer.File, readonly userId: string) {}
}
@CommandHandler(UploadImageCommand)
export class UploadImageUseCase implements ICommand {
  constructor(public usersRepo: UsersRepository) {}
  async execute({ userId, photo }: UploadImageCommand) {
    const profile = await this.usersRepo.findProfileByUserId(userId);
  }
}
