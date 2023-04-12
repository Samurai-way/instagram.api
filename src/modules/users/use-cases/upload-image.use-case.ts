import { Injectable } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';

@Injectable()
export class UploadImageCommand {
  constructor() {}
}
@CommandHandler(UploadImageCommand)
export class UploadImageUseCase {
  constructor() {}
  async execute(command: UploadImageCommand) {}
}
