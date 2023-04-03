import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommand } from '@nestjs/cqrs';

@Injectable()
export class LogoutCommand {
  constructor() {}
}

@CommandHandler(LogoutCommand)
export class LogoutUseCase implements ICommand {
  constructor() {}

  async execute(command: LogoutCommand) {}
}
