import { Injectable } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';

@Injectable()
export class CreatePostCommand {
  constructor() {}
}
@CommandHandler(CreatePostCommand)
export class CreatePostUseCase {
  constructor() {}
  async execute({}: CreatePostCommand) {}
}
