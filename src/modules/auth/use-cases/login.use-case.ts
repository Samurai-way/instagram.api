import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommand } from '@nestjs/cqrs';
import { User } from '@prisma/client';

@Injectable()
export class LoginCommand {
  constructor(
    readonly ip: string,
    readonly title: string,
    readonly user: User,
  ) {}
}

@CommandHandler(LoginCommand)
export class LoginUseCase implements ICommand {
  constructor() {}

  async execute(command: LoginCommand) {}
}
