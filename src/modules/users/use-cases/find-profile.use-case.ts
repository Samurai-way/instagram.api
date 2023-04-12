import { Injectable } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';

@Injectable()
export class FindProfileCommand {
  constructor() {}
}

@CommandHandler(FindProfileCommand)
export class FindProfileUseCase {
  constructor() {}

  async execute(command: FindProfileCommand) {}
}
