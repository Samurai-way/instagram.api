import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommand } from '@nestjs/cqrs';

@Injectable()
export class UpdateProfileCommand {
  constructor() {}
}

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileUseCase implements ICommand {
  constructor() {}

  async execute(command: UpdateProfileCommand) {}
}
