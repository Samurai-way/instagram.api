import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommand } from '@nestjs/cqrs';

@Injectable()
export class ConfirmationCommand {
  constructor() {}
}
@CommandHandler(ConfirmationCommand)
export class ConfirmationUseCase implements ICommand {
  constructor() {}
  async execute(command: ConfirmationCommand) {}
}
