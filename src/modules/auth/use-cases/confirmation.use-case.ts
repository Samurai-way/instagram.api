import { BadRequestException, Injectable } from '@nestjs/common';
import { CommandHandler, ICommand } from '@nestjs/cqrs';
import { UsersRepository } from '../../users/repository/users.repository';
import { EmailConfirmation } from '@prisma/client';

@Injectable()
export class ConfirmationCommand {
  constructor(readonly code: string) {}
}

@CommandHandler(ConfirmationCommand)
export class ConfirmationUseCase implements ICommand {
  constructor(private readonly usersRepo: UsersRepository) {}

  async execute(command: ConfirmationCommand): Promise<EmailConfirmation> {
    const user: any = await this.usersRepo.findUserByCode(command.code);
    if (!user)
      throw new BadRequestException([
        { message: 'User by code not found', field: 'code' },
      ]);
    console.log('user', user);
    if (user.emailConfirmation.isConfirmed) {
      throw new BadRequestException([
        {
          message: 'Code is confirmed',
          field: 'code',
        },
      ]);
    }
    return this.usersRepo.updateEmailConfirmationIsConfirmed(command.code);
  }
}
