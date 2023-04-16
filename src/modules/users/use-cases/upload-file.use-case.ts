import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommand } from '@nestjs/cqrs';

@Injectable()
export class UploadFileCommand {
  constructor() {}
}

@CommandHandler(UploadFileCommand)
export class UploadFileUseCase implements ICommand {
  constructor() {}

  async execute(command: UploadFileCommand) {}
}
