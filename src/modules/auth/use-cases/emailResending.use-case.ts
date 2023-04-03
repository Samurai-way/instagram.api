import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommand } from '@nestjs/cqrs';

@Injectable()
export class EmailResendingCommand {
  constructor() {}
}

@CommandHandler(EmailResendingCommand)
export class EmailResendingUseCase implements ICommand {
  constructor() {}

  async execute(command: EmailResendingCommand) {}
}
